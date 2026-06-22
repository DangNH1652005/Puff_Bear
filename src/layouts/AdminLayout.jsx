import { Outlet } from "react-router";
import { useState } from "react";
import { Offcanvas } from "react-bootstrap";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminNavbar from "../components/admin/AdminNavbar";

const AdminLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="d-flex vh-100">
      {/* Desktop Sidebar */}
      <aside
        className="d-none d-lg-block border-end bg-white"
        style={{ width: "260px" }}
      >
        <AdminSidebar />
      </aside>

      {/* Mobile Sidebar */}
      <Offcanvas
        show={showSidebar}
        onHide={() => setShowSidebar(false)}
        placement="start"
        className="d-lg-none"
      >
        <Offcanvas.Body className="p-0">
          <AdminSidebar />
        </Offcanvas.Body>
      </Offcanvas>

      {/* Content */}
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        <AdminNavbar onMenuClick={() => setShowSidebar(true)} />

        <main className="flex-grow-1 overflow-auto p-4" style={{ background: "#fff5f8" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
