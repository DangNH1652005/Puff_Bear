import { Card } from "react-bootstrap";

const CartSummary = ({ totalPriceCart }) => {

    return (
        <Card className="shadow-sm border-0 rounded-4">
            <Card.Body>
                <h4 className="mb-4">Tóm tắt đơn hàng</h4>

                <div className="d-flex justify-content-between mb-3">
                    <span>Tạm tính</span>
                    <span>
                        {totalPriceCart.toLocaleString("vi-VN")} VND
                    </span>
                </div>

                <hr />

                <div className="d-flex justify-content-between">
                    <strong>Tổng cộng</strong>
                    <strong className="text-danger">
                        {totalPriceCart.toLocaleString("vi-VN")} VND
                    </strong>
                </div>
            </Card.Body>
        </Card>
    );
};

export default CartSummary;