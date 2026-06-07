import { Card, Image } from "react-bootstrap";

const CartItem = ({ item }) => {
    return (
        <Card className="shadow-sm border-0 rounded-4">
            <Card.Body>
                <div className="d-flex gap-3">
                    <Image
                        src={item.product?.image || item.product?.images?.[0]}
                        alt={item.product?.name}
                        rounded
                        width={120}
                        height={120}
                        style={{ objectFit: "cover" }}
                    />

                    <div>
                        <h5>
                            {item.product?.name || "Sản phẩm không xác định"}
                        </h5>

                        <p className="text-muted mb-1">
                            <strong>Size:</strong> {item.size.label}
                        </p>

                        <p className="text-muted mb-1">
                            <strong>Color:</strong> {item.color.name}
                        </p>

                        <p className="mb-1">
                            <strong>Quantity:</strong> {item.quantity}
                        </p>

                        <h6 className="text-danger">
                            {item.totalPrice?.toLocaleString("vi-VN")} VND
                        </h6>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default CartItem;