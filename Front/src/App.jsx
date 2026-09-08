import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import LoginForm from "./components/LoginForm";
import AdminLoginForm from "./components/AdminLoginForm";
import RegisterForm from "./components/RegisterForm";
import Unauthorized401 from "./components/Unauthorized401";
import NotFound404 from "./components/NotFound404";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductsDashboard from "./components/ProductsDashboard";

function App() {
  useEffect(() => {
    const text = "MJM 3D - Impresiones y Diseños Únicos";
    // Usamos el espacio en blanco especial '\u2000' (En-Space) para homogeneizar el ancho
    const separator = "\u2000\u2000•\u2000\u2000";
    const marqueeText = `${text}${separator}`;

    let index = 0;
    // 200ms es la velocidad donde el navegador logra renderizar CADA frame sin saltearse ticks
    const speed = 200;

    const interval = setInterval(() => {
      index = (index + 1) % marqueeText.length;
      document.title = marqueeText.slice(index) + marqueeText.slice(0, index);
    }, speed);

    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/*Public routes*/}
          <Route path="/" element={<><Header /><Home /><Footer /></>} />
          <Route path="/login" element={<><Header /><LoginForm /><Footer /></>} />
          <Route path="/login-admin" element={<AdminLoginForm />} />
          <Route path="/registro" element={<><Header /><RegisterForm /><Footer /></>} />
          <Route path="/401" element={<><Header /><Unauthorized401 /><Footer /></>} />
          {/*Protected routes*/}
          <Route path="/panel-secured" element={
            <ProtectedRoute requiredRole="admin">
              <ProductsDashboard />
            </ProtectedRoute>
          } />
          {/*If no match route, redirect to 404*/}
          <Route path="*" element={<NotFound404 />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;