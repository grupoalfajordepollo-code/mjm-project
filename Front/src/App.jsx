import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import CatalogPage from "./components/CatalogPage";
import LoginForm from "./components/LoginForm";
import AdminLoginForm from "./components/AdminLoginForm";
import RegisterForm from "./components/RegisterForm";
import Unauthorized401 from "./components/Unauthorized401";
import NotFound404 from "./components/NotFound404";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductsDashboard from "./components/ProductsDashboard";
import ProductDetail from "./components/ProductDetail";

// Remount por id: al navegar detalle -> detalle (ej. desde el buscador del
// Header) resetea imagen activa, cantidad y feedback sin setStates en efecto.
const ProductDetailRoute = () => {
  const { id } = useParams();
  return <ProductDetail key={id ?? "sin-id"} />;
};

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
          <Route path="/catalogo" element={<><Header /><CatalogPage /><Footer /></>} />
          <Route path="/producto/:id" element={<><Header /><ProductDetailRoute /><Footer /></>} />
          <Route path="/producto" element={<><Header /><ProductDetail /><Footer /></>} />
          <Route path="/login" element={<><Header /><LoginForm /><Footer /></>} />
          <Route path="/login-admin" element={<AdminLoginForm />} />
          <Route path="/registro" element={<><Header /><RegisterForm /><Footer /></>} />
          <Route path="/401" element={<><Header /><Unauthorized401 /><Footer /></>} />
          {/*Protected routes*/}
          <Route path="/panel-secured" element={
            <ProtectedRoute requiredRole="admin">
              <ProductsDashboard key="productos" />
            </ProtectedRoute>
          } />
          <Route path="/panel-secured/pedidos" element={
            <ProtectedRoute requiredRole="admin">
              <ProductsDashboard key="pedidos" vistaInicial="pedidos" />
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