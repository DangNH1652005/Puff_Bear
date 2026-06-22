import { Button, Form } from "react-bootstrap";
import { useColorStore } from "../../store/color.store";
import { useState } from "react";

const InputColor = () => {
  const [color, setColor] = useState("");
  const { addColor } = useColorStore();
  const handleSubmit = async (e) => {
    e.preventDefault();

    await addColor({
      name: color.toLowerCase()
    });
    setSize("");
  };
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Color</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter size"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </Form.Group>

      <Button type="submit" variant="primary">
        Add Color
      </Button>
    </Form>
  )

}

export default InputColor
