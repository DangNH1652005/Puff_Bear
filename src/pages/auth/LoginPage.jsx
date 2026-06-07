import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEnvelope, FaLock } from "react-icons/fa";
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

const LoginPage = () => {
  const navigate = useNavigate();

  const { login } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { role } = await login(email, password);
      toast.success("Đăng nhập thành công");

      if (!role) {
        return;
      }

      if (role.name === "customer") {
        navigate("/");
      } else if (role.name === "admin") {
        navigate("/admin");
      } else if (role.name === "staff") {
        navigate("/staff");
      } else {
        toast.error("không có role mà bạn tìm");
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
                  <h3 className="mb-1">Đăng nhập</h3>
                  <p className="text-muted small mb-4">
                    Nhập thông tin tài khoản để tiếp tục
                  </p>

                  <Form onSubmit={handleSubmit}>
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

                    {/* OPTIONS */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <Form.Check
                        type="checkbox"
                        label="Ghi nhớ đăng nhập"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                      />

                      <a href="#" className="text-decoration-none text-danger">
                        Quên mật khẩu?
                      </a>
                    </div>

                    {/* BUTTON */}
                    <Button className="w-100 py-2" variant="dark" type="submit">
                      Đăng nhập
                    </Button>
                  </Form>

                  {/* REGISTER */}
                  <div className="text-center mt-3 small">
                    Chưa có tài khoản?{" "}
                    <Link
                      to="/auth/register"
                      className="text-danger fw-semibold"
                    >
                      Đăng ký ngay
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
                <h4 className="fw-bold">Gấu bông dễ thương</h4>
                <p className="text-muted mb-0">
                  Khám phá bộ sưu tập gấu bông đáng yêu với chất lượng cao và đa
                  dạng mẫu mã.
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
