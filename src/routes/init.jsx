import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import AdminProducts from "../pages/admin/AdminProducts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/admin/products",
    element: <AdminProducts />,
  },
]);

export default router;