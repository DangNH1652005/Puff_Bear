import { useEffect } from "react";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import { checkAndCreateAdmin } from "./services/user/user.logic";
import { shouldInitAdmin } from "./utils/init";

function App() {
  useEffect(() => {
    if (!shouldInitAdmin()) return;

    const initAdmin = async () => {
      try {
        const result = await checkAndCreateAdmin();
        console.log(result?.message);
      } catch (err) {
        console.error("Failed to initialize Admin:", err);
      }
    };

    initAdmin();
  }, []);

  return (
    <div>
      <AppRoutes />
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}

export default App;
