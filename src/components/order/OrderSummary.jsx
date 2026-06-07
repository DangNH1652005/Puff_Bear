import { Card, Button } from "react-bootstrap";

const OrderSummary = ({ checkout, product, onPlaceOrder }) => {
    return (
        <Card className="p-4">
            <h5 className="mb-3">Order Summary</h5>

            {product && (
                <div className="d-flex gap-3 mb-3">
                    <img
                        src={product.image}
                        alt={product.name}
                        width="80"
                        height="80"
                        style={{
                            objectFit: "cover",
                            borderRadius: "8px",
                        }}
                    />

                    <div className="d-flex flex-column">
                        <small className="text-muted">
                            Số lượng: {checkout.quantity}
                        </small>

                        <small className="text-muted">
                            Màu sắc: {checkout.color}
                        </small>

                        <small className="text-muted">
                            Kích cỡ: {checkout.size}
                        </small>
                    </div>

                </div>
            )}

            <hr />

            <div className="d-flex justify-content-between mb-2">
                <span>Giá</span>
                <span>
                    {product?.price?.toLocaleString("vi-VN")}đ
                </span>
            </div>

            <div className="d-flex justify-content-between mb-2">
                <span>Số lượng</span>
                <span>{checkout.quantity}</span>
            </div>

            <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Tổng giá</span>
                <span>
                    {checkout.totalPrice?.toLocaleString("vi-VN")}đ
                </span>
            </div>

            <Button className="w-100 mt-4" onClick={onPlaceOrder}>
                Place Order
            </Button>
        </Card>
    );
};

export default OrderSummary;