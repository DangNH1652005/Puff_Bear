import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Modal,
  Form,
  Spinner,
} from "react-bootstrap";
import {
  User,
  Mail,
  MapPin,
  Phone,
  Calendar,
  ShieldAlert,
  Edit3,
  Camera,
  Check,
  X,
} from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import { useUserStore } from "../../store/user.store";

const ProfileAdminPage = () => {
  const { user: authUser } = useAuthStore();
  const { user: adminData, fetchUser, updateUser } = useUserStore();

  useEffect(() => {
    if (authUser?.id) {
      fetchUser(authUser.id);
    }
  }, [authUser?.id, fetchUser]);

  // State quản lý việc đóng/mở Modal chỉnh sửa
  const [showEditModal, setShowEditModal] = useState(false);

  // State lưu trữ dữ liệu tạm thời khi đang chỉnh sửa trong Form
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (adminData) {
      setFormData({
        fullName: adminData.fullName || "",
        email: adminData.email || "",
        phone: adminData.phone || "",
        address: adminData.address || "",
        avatar: adminData.avatar || "",
      });
    }
  }, [adminData]);

  // Định dạng ngày tháng hiển thị đẹp hơn
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Xử lý thay đổi input trong Form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (adminData?.id) {
      try {
        await updateUser(adminData.id, formData);
        setShowEditModal(false);
      } catch (error) {
        console.error("Lỗi cập nhật profile:", error);
      }
    }
  };

  if (!adminData) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" style={{ color: "#ff6b8b" }} />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {/* Thêm chút CSS Custom trực tiếp để tối ưu tone màu hồng gấu bông */}
      <style>{`
        .bg-pink-gradient {
          background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%);
        }
        .text-pink-dark { color: #d63384; }
        .btn-pink {
          background-color: #ff6b8b;
          border-color: #ff6b8b;
          color: white;
        }
        .btn-pink:hover {
          background-color: #ff477e;
          border-color: #ff477e;
          color: white;
        }
        .btn-outline-pink {
          color: #ff6b8b;
          border-color: #ff6b8b;
        }
        .btn-outline-pink:hover {
          background-color: #ff6b8b;
          color: white;
        }
        .border-pink { border-color: #fecfef !important; }
        .focus-pink:focus {
          border-color: #ff9a9e;
          box-shadow: 0 0 0 0.25rem rgba(255, 154, 158, 0.25);
        }
      `}</style>

      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          {/* Toàn bộ Card Profile */}
          <Card
            className="shadow-sm border-0 overflow-hidden"
            style={{ borderRadius: "15px" }}
          >
            {/* Banner Màu Hồng Phía Trên */}
            <div className="bg-pink-gradient text-center py-5 position-relative">
              <Badge
                bg="light"
                className="text-pink-dark position-absolute top-0 end-0 m-3 px-3 py-2 border border-pink"
                style={{ borderRadius: "20px", fontSize: "0.85rem" }}
              >
                <ShieldAlert size={14} className="me-1 align-middle" />
                {adminData.role.toUpperCase()}
              </Badge>

              {/* Khung Ảnh Đại Diện */}
              <div className="position-relative d-inline-block mt-3">
                <img
                  src={adminData.avatar}
                  alt="Admin Avatar"
                  className="rounded-circle border border-4 border-white shadow"
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                  }}
                />
              </div>

              <h3 className="text-white fw-bold mt-3 mb-1">
                {adminData.fullName}
              </h3>
              <p className="text-white-50 small mb-0">ID: {adminData.id}</p>
            </div>

            {/* Phần hiển thị chi tiết thông tin */}
            <Card.Body className="p-4 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-pink">
                <h5 className="mb-0 fw-bold text-secondary text-pink-dark">
                  Thông tin tài khoản
                </h5>
                <Button
                  variant="pink"
                  className="d-flex align-items-center gap-2 rounded-pill px-4 shadow-sm"
                  onClick={() => {
                    setFormData({
                      fullName: adminData.fullName || "",
                      email: adminData.email || "",
                      phone: adminData.phone || "",
                      address: adminData.address || "",
                      avatar: adminData.avatar || "",
                    });
                    setShowEditModal(true);
                  }}
                >
                  <Edit3 size={16} />
                  <span>Chỉnh sửa</span>
                </Button>
              </div>

              <Row className="g-4">
                {/* Email */}
                <Col sm={6}>
                  <div className="d-flex align-items-start gap-3">
                    <div className="p-2 bg-light text-pink-dark rounded-3 border border-pink">
                      <Mail size={20} />
                    </div>
                    <div>
                      <small className="text-muted d-block">Email</small>
                      <span className="fw-semibold text-dark">
                        {adminData.email}
                      </span>
                    </div>
                  </div>
                </Col>

                {/* Số điện thoại */}
                <Col sm={6}>
                  <div className="d-flex align-items-start gap-3">
                    <div className="p-2 bg-light text-pink-dark rounded-3 border border-pink">
                      <Phone size={20} />
                    </div>
                    <div>
                      <small className="text-muted d-block">
                        Số điện thoại
                      </small>
                      <span className="fw-semibold text-dark">
                        {adminData.phone}
                      </span>
                    </div>
                  </div>
                </Col>

                {/* Địa chỉ */}
                <Col sm={6}>
                  <div className="d-flex align-items-start gap-3">
                    <div className="p-2 bg-light text-pink-dark rounded-3 border border-pink">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <small className="text-muted d-block">Địa chỉ</small>
                      <span className="fw-semibold text-dark">
                        {adminData.address}
                      </span>
                    </div>
                  </div>
                </Col>

                {/* Ngày tạo */}
                <Col sm={6}>
                  <div className="d-flex align-items-start gap-3">
                    <div className="p-2 bg-light text-pink-dark rounded-3 border border-pink">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <small className="text-muted d-block">
                        Ngày tham gia hệ thống
                      </small>
                      <span className="fw-semibold text-dark">
                        {formatDate(adminData.createdAt)}
                      </span>
                    </div>
                  </div>
                </Col>

                {/* Trạng thái hoạt động */}
                <Col sm={6}>
                  <div className="d-flex align-items-start gap-3">
                    <div className="p-2 bg-light text-pink-dark rounded-3 border border-pink">
                      <User size={20} />
                    </div>
                    <div>
                      <small className="text-muted d-block">Trạng thái</small>
                      <Badge
                        bg="success"
                        className="text-capitalize px-3 py-1.5 rounded-pill mt-1"
                        style={{ fontSize: "0.8rem" }}
                      >
                        {adminData.status === "active"
                          ? "Đang hoạt động"
                          : adminData.status}
                      </Badge>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* MODAL CHỈNH SỬA THÔNG TIN */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
        backdrop="static"
      >
        <Form onSubmit={handleSaveChanges}>
          <Modal.Header className="border-pink bg-light">
            <Modal.Title
              className="fw-bold text-pink-dark"
              style={{ fontSize: "1.25rem" }}
            >
              <Edit3 size={20} className="me-2 align-middle" />
              Cập nhật hồ sơ Admin
            </Modal.Title>
            <Button
              variant="link"
              className="p-0 text-muted"
              onClick={() => setShowEditModal(false)}
            >
              <X size={24} />
            </Button>
          </Modal.Header>

          <Modal.Body className="p-4">
            <Row className="g-3">
              <Col xs={12}>
                <Form.Group controlId="editFullName">
                  <Form.Label className="small fw-semibold text-muted">
                    Họ và tên
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="focus-pink py-2"
                    required
                  />
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group controlId="editEmail">
                  <Form.Label className="small fw-semibold text-muted">
                    Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="focus-pink py-2"
                    required
                  />
                </Form.Group>
              </Col>

              <Col sm={6}>
                <Form.Group controlId="editPhone">
                  <Form.Label className="small fw-semibold text-muted">
                    Số điện thoại
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="focus-pink py-2"
                  />
                </Form.Group>
              </Col>

              <Col sm={6}>
                <Form.Group controlId="editAddress">
                  <Form.Label className="small fw-semibold text-muted">
                    Địa chỉ
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="focus-pink py-2"
                  />
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group controlId="editAvatar">
                  <Form.Label className="small fw-semibold text-muted">
                    Đường dẫn ảnh đại diện (URL)
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleInputChange}
                    className="focus-pink py-2"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer className="border-top-0 d-flex gap-2 justify-content-end p-4 pt-0">
            <Button
              variant="outline-pink"
              className="rounded-pill px-4 d-flex align-items-center gap-1"
              onClick={() => setShowEditModal(false)}
            >
              <X size={16} /> Hủy
            </Button>
            <Button
              variant="pink"
              type="submit"
              className="rounded-pill px-4 d-flex align-items-center gap-1 shadow-sm"
            >
              <Check size={16} /> Lưu thay đổi
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default ProfileAdminPage;
