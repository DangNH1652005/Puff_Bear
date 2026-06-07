import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCheckoutById } from "../../services/checkout/checkout.service";
import { getProductById } from "../../services/product/product.service";
import { placeOrder } from "../../services/order/order.logic";
import OrderSummary from "../../components/order/OrderSummary";
import PaymentMethod from "../../components/order/PaymentMethod";
import ShippingForm from "../../components/order/ShippingForm";
import { Alert, Col, Container, Row, Spinner } from "react-bootstrap";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [checkout, setCheckout] = useState(null);
  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    receiverName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    zipCode: ""
  });

  useEffect(() => {
    const fetchCheckout = async () => {
      setLoading(true);
      setError(null);

      try {
        const checkoutData = await getCheckoutById(id);
        setCheckout(checkoutData);

        if (checkoutData?.proId) {
          const productData = await getProductById(checkoutData.proId);
          setProduct(productData);
        }
      } catch (err) {
        setError(err.message || "Failed to load checkout");
      } finally {
        setLoading(false);
      }
    };

    fetchCheckout();
  }, [id]);

  const handleShippingChange = (name, value) => {
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    try {
      setSubmitting(true);
      // user ID is 3 for now as hardcoded in db.json for dang nguyen, but let's pass from checkout or just 3
      const orderForm = {
        ...shippingInfo,
        userId: checkout.userId || "3"
      };

      const selection = {
        size: checkout.size,
        color: checkout.color,
        quantity: checkout.quantity
      };

      const { order } = await placeOrder(orderForm, product, selection);
      toast.success("Order placed successfully!");
      navigate(`/order-success/${order.id}`);
    } catch (err) {
      toast.error(err.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!checkout) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          Checkout not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">Checkout</h2>

      <Row>
        <Col lg={8}>
          <ShippingForm 
            shippingInfo={shippingInfo} 
            onChange={handleShippingChange} 
          />
          <PaymentMethod />
        </Col>

        <Col lg={4}>
          <OrderSummary
            checkout={checkout}
            product={product}
            onPlaceOrder={handlePlaceOrder}
          />
          {submitting && <div className="text-center mt-2"><Spinner size="sm" animation="border" /> Processing...</div>}
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
