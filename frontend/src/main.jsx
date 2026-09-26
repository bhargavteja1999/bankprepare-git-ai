import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import App from "./App.jsx";
import router from "./router.jsx";
import "./index.css";

// Toggle: set VITE_USE_ROUTER=true to use createBrowserRouter, else legacy state routing via App.jsx
const useRouter = import.meta.env.VITE_USE_ROUTER === "true";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        {useRouter ? <RouterProvider router={router} /> : <App />}
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
