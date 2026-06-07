import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import HomePage from "./pages/HomePage";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import { initRolesLogic } from "./services/role/role.logic";

function App() {
  useEffect(() => {
    initRolesLogic();
  }, []);

  return (
    <>
      <AppRoutes />

      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;
