import React from "react";
import { Outlet } from "react-router";
import { useState } from "react";
import { NavbarBrand, Offcanvas } from "react-bootstrap";

import StaffNavbar from "../components/staff/StaffNavbar";
import StaffSidebar from "../components/staff/StaffSidebar";

const StaffLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="d-flex vh-100">
      {/* Desktop Sidebar */}
      <aside
        className="d-none d-lg-block border-end bg-white"
        style={{ width: "260px" }}
      >
        <StaffSidebar />
      </aside>

      {/* Mobile Sidebar */}
      <Offcanvas
        show={showSidebar}
        onHide={() => setShowSidebar(false)}
        placement="start"
        className="d-lg-none"
      >
        <Offcanvas.Body className="p-0">
          <StaffSidebar />
        </Offcanvas.Body>
      </Offcanvas>

      {/* Content */}
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        <StaffNavbar onMenuClick={() => setShowSidebar(true)} />

        <main className="flex-grow-1 overflow-auto p-4 bg-light">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
