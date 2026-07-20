import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEnvelope, FaLock, FaUser } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  InputGroup,
} from "react-bootstrap";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/auth.store";
import { role } from "../../constants/role.constant";

const RegisterPage = () => {
  const navigate = useNavigate();

  const { register } = useAuthStore();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await register(fullName, email, password);
      toast.success("Registration successful");

      if (user.role === role.CUSTOMER) {
        navigate("/");
      } else if (user.role === role.ADMIN) {
        navigate("/admin");
      } else if (user.role === role.STAFF) {
        navigate("/staff");
      } else {
        toast.error("Role does not exist");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <Container fluid className="min-vh-100 p-0">
        <Row className="g-0 min-vh-100">
          {/* LEFT SIDE */}
          <Col
            lg={6}
            className="d-flex align-items-center justify-content-center p-5"
          >
            <div style={{ maxWidth: 420, width: "100%" }}>
              {/* Header */}
              <div className="mb-4">
                <div className="fs-1">🧸</div>
                <h1 className="fw-bold">Puff Bear</h1>
                <p className="text-muted">Chào mừng bạn trở lại!</p>
              </div>

              {/* Card */}
              <Card className="border-0 shadow-sm rounded-4">
                <Card.Body className="p-4">
                  <h3 className="mb-1">Đăng ký</h3>
                  <p className="text-muted small mb-4">
                    Nhập thông tin tài khoản để tiếp tục
                  </p>

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Họ và tên</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FaUser />
                        </InputGroup.Text>

                        <Form.Control
                          type="text"
                          placeholder="Nguyễn Văn A"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                        />
                      </InputGroup>
                    </Form.Group>

                    {/* EMAIL */}
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FaRegEnvelope />
                        </InputGroup.Text>
                        <Form.Control
                          type="email"
                          placeholder="example@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </InputGroup>
                    </Form.Group>

                    {/* PASSWORD */}
                    <Form.Group className="mb-3">
                      <Form.Label>Mật khẩu</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FaLock />
                        </InputGroup.Text>

                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />

                        <Button
                          variant="outline-secondary"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </Button>
                      </InputGroup>
                    </Form.Group>
                    {/* BUTTON */}
                    <Button className="w-100 py-2" variant="dark" type="submit">
                      Đăng ký
                    </Button>
                  </Form>

                  {/* REGISTER */}
                  <div className="text-center mt-3 small">
                    Đã có tài khoản?{" "}
                    <Link to="/auth/login" className="text-danger fw-semibold">
                      Đăng nhập ngay
                    </Link>
                  </div>

                  {/* GO TO HOME PAGE */}
                  <div className="text-center mt-3 small">
                    <Link to="/" className="text-secondary text-decoration-none">
                      ← Trở về Trang chủ
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
          {/* RIGHT SIDE */}
          <Col lg={6} className="d-none d-lg-block p-4">
            <div className="h-100 rounded-4 overflow-hidden position-relative">
              <img
                src="https://images.unsplash.com/photo-1556012018-50c5c0da73bf?auto=format&fit=crop&w=1200&q=80"
                alt="teddy"
                className="w-100 h-100"
                style={{ objectFit: "cover" }}
              />

              {/* overlay card */}
              <div
                className="position-absolute bottom-0 start-0 m-4 p-4 bg-white bg-opacity-90 rounded-4 shadow"
                style={{ maxWidth: 360 }}
              >
                <h4 className="fw-bold">Bắt đầu hành trình</h4>
                <p className="text-muted mb-0">
                  Tham gia cộng đồng yêu thích gấu bông và khám phá những sản
                  phẩm độc đáo nhất!
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegisterPage;
