import { Button } from "react-bootstrap";
import { useSizeStore } from "../../store/size.store";
import "../../styles/admin/AdminSizeColor.css";

const SizeRow = ({ id, size }) => {
  const { removeSize } = useSizeStore();

  const handleDelete = async () => {
    await removeSize(id);
  };

  return (
    <div className="size-row-item">
      <div className="size-row-left">
        <span className="drag-dot">⋮⋮</span>
        <span className="size-name">Size {size}</span>
      </div>

      <Button
        className="size-delete-btn"
        variant="danger"
        onClick={handleDelete}
      >
        Delete
      </Button>
    </div>
  )
}

export default SizeRow
