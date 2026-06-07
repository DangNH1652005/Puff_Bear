import { Card, Button } from "react-bootstrap";

const OrderSummary = ({ totalPriceCart, cartItems }) => {
  return (
    <Card className="p-4 shadow-sm border-0 rounded-4">
      <h5 className="mb-3">Order Summary</h5>

      {cartItems.map((item) => (
        <div key={item.id} className="d-flex justify-content-between mb-3">
          <div className="d-flex gap-2 align-items-center">
            <img
              src={item.product?.image}
              alt={item.product?.name}
              width="60"
              height="60"
              className="rounded"
              style={{
                objectFit: "cover",
              }}
            />

            <div>
              <div className="fw-semibold">{item.product?.name}</div>

              <small className="text-muted d-block">
                Size: {item.size?.label}
                
              </small>

              <small className="text-muted d-block">
                Color: {item.color?.name}
              </small>
            </div>
          </div>

          <div className="text-end">
            <div>x{item.quantity}</div>

            <small className="text-muted">
              {item.totalPrice.toLocaleString("vi-VN")}đ
            </small>
          </div>
        </div>
      ))}

      <hr />

      <div className="d-flex justify-content-between mb-2">
        <span>Tổng sản phẩm</span>
        <span>{cartItems.length}</span>
      </div>

      <div className="d-flex justify-content-between fw-bold fs-5">
        <span>Tổng giá</span>
        <span>{totalPriceCart.toLocaleString("vi-VN")}đ</span>
      </div>
    </Card>
  );
};

export default OrderSummary;
