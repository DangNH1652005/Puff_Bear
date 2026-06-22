import { Button } from "react-bootstrap";
import { useColorStore } from "../../store/color.store";

const ColorRow = ({ id, color }) => {
  const { removeColor } = useColorStore();

  const handleDelete = async () => {
    await removeColor(id);
  };

  return (
    <div>
      <div>{color}</div>

      <Button
        variant="danger"
        onClick={handleDelete}
      >
        Delete
      </Button>
    </div>
  )
}

export default ColorRow
