import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { getProductById } from "../../services/product/product.service";
import { placeOrder } from "../../services/order/order.logic";
import OrderSummary from "../../components/order/OrderSummary";
import ShippingForm from "../../components/order/ShippingForm";
import { Alert, Button, Col, Container, Row, Spinner } from "react-bootstrap";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/auth.store";
import { useCartStore } from "../../store/cart.store";

const CheckoutPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    receiverName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
  });

  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  const { cartItems, totalPriceCart, fetchCart } = useCartStore();

  useEffect(() => {
    if (user?.id) {
      fetchCart(user.id);
    }
  }, [user?.id, fetchCart]);

  const handleShippingChange = (name, value) => {
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    try {
      const res = await placeOrder(user, shippingInfo, totalPriceCart, cartItems)
      
      if (res) {
        navigate(`/order-success/${res.id}`)
      }
    } catch (error) {
      toast.error(error.message);
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

  return (
    <Container className="py-4">
      <h2 className="mb-4">Checkout</h2>

      <Row>
        <Col lg={8}>
          <ShippingForm
            shippingInfo={shippingInfo}
            onChange={handleShippingChange}
          />
        </Col>

        <Col lg={4}>
          <OrderSummary
            totalPriceCart={totalPriceCart}
            cartItems={cartItems}
          />
          {submitting && (
            <div className="text-center mt-2">
              <Spinner size="sm" animation="border" /> Processing...
            </div>
          )}

          <Button className="w-100 mt-4 rounded-pill" size="lg" onClick={handlePlaceOrder}>
            Thanh toán
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
