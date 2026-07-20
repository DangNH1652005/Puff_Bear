import { Button, Form } from "react-bootstrap";
import { useColorStore } from "../../store/color.store";
import { useState } from "react";
import toast from "react-hot-toast";
import "../../styles/admin/AdminSizeColor.css";

const InputColor = () => {
  const [color, setColor] = useState("");
  const { addColor, colors } = useColorStore();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = color.trim();
    if (!trimmed) return;

    const isDuplicate = colors.some(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) {
      toast.error(`Màu "${trimmed.toLowerCase()}" đã tồn tại!`);
      return;
    }

    await addColor({ name: trimmed.toLowerCase() });
    setColor("");
  };
  return (
    <Form className="color-add-form" onSubmit={handleSubmit}>
      <Form.Group className="color-input-group">
        <Form.Label>Color</Form.Label>

        <Form.Control
          className="color-input"
          type="text"
          placeholder="Enter color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </Form.Group>

      <Button className="color-add-btn" type="submit" variant="primary">
        Add Color
      </Button>
    </Form>
  )

}

export default InputColor
