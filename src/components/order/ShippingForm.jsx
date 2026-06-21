import React from "react";
import { Card, Row, Col, Form } from "react-bootstrap";

const ShippingForm = ({ shippingInfo, onChange }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange(name, value);
    };

    return (
        <Card className="p-4 mb-4">
            <h5 className="mb-3">Thông tin giao hàng</h5>

            <Row className="g-3">
                <Col md={6}>
                    <Form.Label>Họ và tên</Form.Label>
                    <Form.Control 
                        required 
                        placeholder="Nguyễn Văn A" 
                        name="receiverName"
                        value={shippingInfo.receiverName || ""}
                        onChange={handleChange}
                    />
                </Col>

                <Col md={6}>
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control 
                        required 
                        name="phone"
                        value={shippingInfo.phone || ""}
                        onChange={handleChange}
                    />
                </Col>

                <Col md={12}>
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                        type="email" 
                        required 
                        name="email"
                        value={shippingInfo.email || ""}
                        onChange={handleChange}
                    />
                </Col>

                <Col md={12}>
                    <Form.Label>Địa chỉ</Form.Label>
                    <Form.Control 
                        required 
                        name="address"
                        value={shippingInfo.address || ""}
                        onChange={handleChange}
                    />
                </Col>

                <Col md={12}>
                    <Form.Label>Thành phố</Form.Label>
                    <Form.Control 
                        required 
                        name="city"
                        value={shippingInfo.city || ""}
                        onChange={handleChange}
                    />
                </Col>
            </Row>
        </Card>
    )
}

export default ShippingForm;