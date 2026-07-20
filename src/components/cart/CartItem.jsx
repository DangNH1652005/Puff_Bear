import { Button, Card, Image } from "react-bootstrap";
import { useCartStore } from "../../store/cart.store";
import { Trash } from "lucide-react";

const CartItem = ({ item }) => {

  const { deleteCartItem } = useCartStore();

  const handleDelete = async () => {
    await deleteCartItem(item.id);
  }

  return (
    <Card className="shadow-sm border-0 rounded-4">
      <Card.Body className="position-relative">
        <Button
          variant="outline-danger"
          size="sm"
          className="position-absolute top-0 end-0 m-3"
          onClick={handleDelete}
        >
          <Trash size={16} />
        </Button>

        <div className="d-flex gap-3">
          <Image
            src={item.product?.mainImageUrl || item.product?.imageUrl?.[0]}
            alt={item.product?.name}
            rounded
            width={120}
            height={120}
            style={{ objectFit: "cover" }}
          />

          <div>
            <h5>{item.product?.name || "Sản phẩm không xác định"}</h5>

            <p className="text-muted mb-1">
              <strong>Size:</strong> {item.size.name}
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
