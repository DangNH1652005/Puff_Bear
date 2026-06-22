import { Button, Form } from "react-bootstrap"
import { useSizeStore } from "../../store/size.store";
import { useState } from "react";

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
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Size</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />
      </Form.Group>

      <Button type="submit" variant="primary">
        Add Size
      </Button>
    </Form>
  )
}

export default InputSize
