import React from "react";
import HomePage from "../pages/HomePage";
import MainNavbar from "../components/public/MainNavbar";
import Footer from "../components/public/Footer";

const Layout = () => {
  return (
    <div>
      <MainNavbar />
      <HomePage />
      <Footer />
    </div>
  );
};

export default Layout;
