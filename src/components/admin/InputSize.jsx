import { Button, Form } from "react-bootstrap"
import { useSizeStore } from "../../store/size.store";
import { useState } from "react";
import "../../styles/admin/AdminSizeColor.css";

const InputSize = () => {
  const [size, setSize] = useState("");
  const { addSize } = useSizeStore();
  const handleSubmit = async (e) => {
    e.preventDefault();

    await addSize({
      name: size.toUpperCase()
    });
    setSize("");
  };
  return (
    <Form className="size-add-form" onSubmit={handleSubmit}>
      <Form.Group className="size-input-group">
        <Form.Label>Size</Form.Label>

        <Form.Control
          className="size-input"
          type="text"
          placeholder="Enter size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />
      </Form.Group>

      <Button className="size-add-btn" type="submit" variant="primary">
        Add Size
      </Button>
    </Form>
  )
}

export default InputSize
