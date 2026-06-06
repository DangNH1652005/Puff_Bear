import { Card, Form } from "react-bootstrap";

const PaymentMethod = () => {
    return (
        <Card className="p-4">
            <h5 className="mb-3">Payment Method</h5>

            <Form.Check
                type="radio"
                label="Cash On Delivery (COD)"
                name="payment"
                defaultChecked
            />

            <Form.Check
                type="radio"
                label="Bank Transfer"
                name="payment"
            />
        </Card>
    );
};

export default PaymentMethod;