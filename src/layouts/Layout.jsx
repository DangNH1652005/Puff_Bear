import MainNavbar from "../components/public/MainNavbar";
import Footer from "../components/public/Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <MainNavbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
