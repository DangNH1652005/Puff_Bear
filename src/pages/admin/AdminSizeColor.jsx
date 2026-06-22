import { Col, Container, Row } from "react-bootstrap"
import SizesManager from "../../components/admin/SizesManager"
import ColorManager from "../../components/admin/ColorManager"

const AdminSizeColor = () => {
  return (
    <Container fluid>
      <Row>
        <Col xs={12} md={6}>
          {/* Nội dung trái */}
          <SizesManager />
        </Col>
        <Col xs={12} md={6}>
          {/* Nội dung phải */}
          <ColorManager />
        </Col>
      </Row>
    </Container>
  )
}

export default AdminSizeColor
