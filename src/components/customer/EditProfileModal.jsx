import { useState } from "react";
import { X } from "lucide-react";
import { Button, Form } from "react-bootstrap";
import { useUserStore } from "../../store/user.store";

export default function EditProfileModal({ user, onClose }) {
  const { updateUser } = useUserStore();

  const [formData, setFormData] = useState({
    fullName: user.fullName || "",
    email: user.email || "",
    phone: user.phone || "",
    address: user.address || "",
    avatar: user.avatar || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    await updateUser(user.id, formData);

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="edit-profile-modal">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4>Chỉnh sửa thông tin</h4>

          <X size={22} style={{ cursor: "pointer" }} onClick={onClose} />
        </div>

        <Form>
          {/* Avatar */}

          <div className="text-center mb-3">
            <img
              src={formData.avatar}
              alt="avatar"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />

            <Form.Group className="mt-3">
              <Form.Label>Avatar URL</Form.Label>

              <Form.Control
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="Nhập URL avatar"
              />
            </Form.Group>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Họ và tên</Form.Label>

            <Form.Control
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>

            <Form.Control
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Số điện thoại</Form.Label>

            <Form.Control
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Địa chỉ</Form.Label>

            <Form.Control
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onClose}>
              Hủy
            </Button>

            <Button variant="danger" onClick={handleSubmit}>
              Lưu
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
