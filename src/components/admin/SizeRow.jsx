import { Button } from "react-bootstrap";
import { useSizeStore } from "../../store/size.store";

const SizeRow = ({ id, size }) => {
  const { removeSize } = useSizeStore();

  const handleDelete = async () => {
    await removeSize(id);
  };

  return (
    <div>
      <div>{size}</div>

      <Button
        variant="danger"
        onClick={handleDelete}
      >
        Delete
      </Button>
    </div>
  )
}

export default SizeRow
