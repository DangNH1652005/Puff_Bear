import { Outlet } from "react-router-dom";

import Header from "../components/public/Header";
import Footer from "../components/public/Footer";

function Layout() {
  return (
    <>
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default Layout;