import { Col, Container, Row } from "react-bootstrap"
import SizesManager from "../../components/admin/SizesManager"
import ColorManager from "../../components/admin/ColorManager"
import "../../styles/admin/AdminSizeColor.css";

const AdminSizeColor = () => {
  return (
    <Container fluid className="admin-size-color-page px-0">
      <div className="admin-size-color-header">
        <h2>Quản lý Size & Màu sắc</h2>
        <p>Cấu hình các lựa chọn hiển thị trên trang sản phẩm</p>
      </div>

      <Row className="admin-size-color-row">
        <Col xs={12} md={6}>
          <div className="admin-size-color-card">
            <SizesManager />
          </div>
        </Col>

        <Col xs={12} md={6}>
          <div className="admin-size-color-card">
            <ColorManager />
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default AdminSizeColor
