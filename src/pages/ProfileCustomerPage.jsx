import {
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Heart,
  Star,
  Shield,
  Calendar,
  Camera,
  Pencil,
} from "lucide-react";

import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";

import "../styles/customer/ProfileCustomerPage.css";
import InfoItem from "../components/public/InfoItem";
import { useAuthStore } from "../store/auth.store";
import { formatDate } from "../utils/calculate";
import { getUserByIdLogic } from "../services/user/user.logic";
import { useUserStore } from "../store/user.store";
import { useEffect, useState } from "react";
import Loading from "../components/public/Loading";
import EditProfileModal from "../components/customer/EditProfileModal";

export default function ProfileCustomerPage() {
  const { user: authUser } = useAuthStore();
  const { user, fetchUser } = useUserStore();
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    if (!authUser?.id) {
      return;
    }

    fetchUser(authUser.id).then((fetchedUser) => {
      if (!fetchedUser) {
        useAuthStore.getState().logout();
      }
    });
  }, [authUser?.id]);

  if (!user) {
    return <Loading />;
  }

  return (
    <Container className="py-5 profile-page">
      <Card className="profile-header shadow-sm border-0">
        <div className="profile-banner" />

        <div className="text-center profile-top">
          <div className="avatar-wrapper">
            <img src={user.avatar} alt="avatar" className="profile-avatar" />
          </div>

          <h2>{user.fullName}</h2>

          <p className="text-muted mb-3">{user.email}</p>

          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Badge bg="" className="status-badge text-success">
              {user.status}
            </Badge>

            <span className="join-date">
              <Calendar size={15} />
              {formatDate(user.createdAt)}
            </span>
          </div>

          <hr />

          <Row className="text-center stats">
            <Col>
              <ShoppingBag size={18} />
              <h3>3</h3>
              <small>Đơn hàng</small>
            </Col>

            <Col>
              <Heart size={18} />
              <h3>8</h3>
              <small>Yêu thích</small>
            </Col>

            <Col>
              <Star size={18} />
              <h3>5</h3>
              <small>Đánh giá</small>
            </Col>
          </Row>
        </div>
      </Card>

      {/* Info */}

      <Card className="shadow-sm mt-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold">
              <User size={18} className="me-2 text-pink" />
              Thông tin cá nhân
            </h5>

            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => setShowEdit(true)}
            >
              <Pencil size={15} />

              <span className="ms-2">Chỉnh sửa</span>
            </Button>
          </div>

          <InfoItem
            icon={<User size={18} />}
            title="Họ và tên"
            value={user.fullName}
          />

          <InfoItem
            icon={<Mail size={18} />}
            title="Email"
            value={user.email}
          />

          <InfoItem
            icon={<Phone size={18} />}
            title="Số điện thoại"
            value={user.phone}
          />

          <InfoItem
            icon={<MapPin size={18} />}
            title="Địa chỉ"
            value={user.address}
          />

          <div className="profile-footer">
            <span>ID : {user.id}</span>

            <Badge pill bg="" className="role-badge">
              {user.role}
            </Badge>
          </div>
        </Card.Body>
      </Card>
      {showEdit && (
        <EditProfileModal user={user} onClose={() => setShowEdit(false)} />
      )}
    </Container>
  );
}
