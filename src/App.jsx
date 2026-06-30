import "./App.css";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import { useEffect } from "react";
import { checkAndCreateAdmin } from "./services/user/user.logic";

function App() {
  useEffect(() => {
    const initAdmin = async () => {
      try {
        const result = await checkAndCreateAdmin();
        if (result) {
          // This will log "Admin already exists..." in the console instead of crashing your UI
          console.log(result.message);
        }
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
