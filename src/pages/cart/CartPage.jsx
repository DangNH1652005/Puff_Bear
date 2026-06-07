import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";

import { useAuthStore } from "../../store/auth.store";
import { useCartStore } from "../../store/cart.store";

import CartList from "../../components/cart/CartList";
import CartSummary from "../../components/cart/CartSummary";
import EmptyCart from "../../components/cart/EmptyCart";

const CartPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { cartItems, totalPriceCart, fetchCart } = useCartStore();

  useEffect(() => {
    if (user?.id) {
      fetchCart(user.id);
    }
  }, [user?.id, fetchCart]);

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">Giỏ hàng của bạn</h1>

      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <Row>
          <Col lg={8}>
            <CartList cartItems={cartItems} />
          </Col>

          <Col lg={4}>
            <CartSummary totalPriceCart={totalPriceCart} />
            <div className="d-grid gap-2 mt-3">
              <Button
                variant="primary"
                size="lg"
                style={{ borderRadius: "30px" }}
              >
                Thanh toán
              </Button>

              <Button
                variant="outline-secondary"
                size="lg"
                style={{ borderRadius: "30px" }}
                onClick={() => navigate("/products")}
              >
                Tiếp tục mua sắm
              </Button>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default CartPage;
