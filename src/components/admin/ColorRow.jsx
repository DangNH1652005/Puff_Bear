import { Button } from "react-bootstrap";
import { useColorStore } from "../../store/color.store";
import "../../styles/admin/AdminSizeColor.css";

const ColorRow = ({ id, color }) => {
  const { removeColor } = useColorStore();

  const handleDelete = async () => {
    await removeColor(id);
  };

  return (
    <div className="color-row-item">
      <div className="color-row-left">
        <span className="drag-dot">⋮⋮</span>

        <span
          className="color-preview-dot"
          style={{ backgroundColor: color }}
        ></span>

        <span className="color-name">{color}</span>
      </div>

      <Button
        className="color-delete-btn"
        variant="danger"
        onClick={handleDelete}
      >
        Delete
      </Button>
    </div>
  )
}

export default ColorRow
