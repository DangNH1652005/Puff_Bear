import { Card } from "react-bootstrap";
import { Truck, Shield, RotateCcw } from "lucide-react";

const FEATURES = [
  {
    icon: Truck,
    title: "Miễn phí vận chuyển",
    desc: "Cho đơn hàng từ 500.000₫",
  },
  {
    icon: Shield,
    title: "Bảo hành 12 tháng",
    desc: "Cam kết chất lượng sản phẩm",
  },
  {
    icon: RotateCcw,
    title: "Đổi trả dễ dàng",
    desc: "Hoàn tiền nếu không hài lòng",
  },
];

const ProductFeatures = () => {
  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        {FEATURES.map(({ icon: Icon, title, desc }, index) => (
          <div
            key={title}
            className={`d-flex align-items-start gap-3 ${index < FEATURES.length - 1 ? "mb-3" : ""}`}
          >
            <Icon size={20} className="text-danger flex-shrink-0 mt-1" />
            <div>
              <div className="fw-semibold small">{title}</div>
              <div className="text-muted small">{desc}</div>
            </div>
          </div>
        ))}
      </Card.Body>
    </Card>
  );
};

export default ProductFeatures;
