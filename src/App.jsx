import "./App.css";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import { useEffect } from "react";
import { checkAndCreateAdmin } from "./services/user/user.logic";

function App() {
  useEffect(() => {
    checkAndCreateAdmin();
  }, [])

  return (
    <div>
      <AppRoutes />
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}

export default App;
