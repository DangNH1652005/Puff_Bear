import React from "react";
import { Navbar, Container, Button } from "react-bootstrap";
import { Menu } from "lucide-react";

const AdminNavbar = ({ onMenuClick }) => {
  return (
    <Navbar
      bg="white"
      className="border-bottom shadow-sm sticky-top"
      style={{ height: "64px", zIndex: 10 }}
    >
      <Container
        fluid
        className="d-flex align-items-center justify-content-between"
      >
        {/* Left Section */}
        <div className="d-flex align-items-center gap-3 flex-grow-1">
          {/* Mobile Menu Button */}
          <Button
            variant="outline-secondary"
            className="d-lg-none d-flex align-items-center justify-content-center"
            style={{ width: "40px", height: "40px" }}
            onClick={onMenuClick}
          >
            <Menu size={20} />
          </Button>

          {/* Title / Logo */}
          <h5 className="mb-0">Admin Dashboard</h5>
        </div>

        {/* Right Section */}
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
