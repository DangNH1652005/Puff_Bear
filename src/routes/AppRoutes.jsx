import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage";
import Layout from "../layouts/Layout";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
