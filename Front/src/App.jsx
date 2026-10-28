
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
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
import Perfil from "./components/Perfil";
import Carrito from "./components/Carrito";
import Terminos from "./components/Terminos";
import Privacidad from "./components/Privacidad";
import Soporte from "./components/Soporte";
import Contacto from "./components/Contacto";

// Componentes de recuperación de contraseña
import RecuperarPassword from "./components/RecuperarPassword";
import RestablecerPassword from "./components/RestablecerPassword";

// Remount por id: al navegar detalle -> detalle
// resetea imagen activa, cantidad y feedback.
const ProductDetailRoute = () => {
  const { id } = useParams();
  return <ProductDetail key={id ?? "sin-id"} />;
};

function App() {
  useEffect(() => {
    const text = "MJM 3D - Impresiones y Diseños Únicos";

    const separator = "\u2000\u2000•\u2000\u2000";
    const marqueeText = `${text}${separator}`;

    let index = 0;
    const speed = 200;

    const interval = setInterval(() => {
      index = (index + 1) % marqueeText.length;
      document.title =
        marqueeText.slice(index) + marqueeText.slice(0, index);
    }, speed);

    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>

            {/* Rutas públicas */}
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <Home />
                  <Footer />
                </>
              }
            />

            <Route
              path="/catalogo"
              element={
                <>
                  <Header />
                  <CatalogPage />
                  <Footer />
                </>
              }
            />

            <Route
              path="/producto/:id"
              element={
                <>
                  <Header />
                  <ProductDetailRoute />
                  <Footer />
                </>
              }
            />

            <Route
              path="/producto"
              element={
                <>
                  <Header />
                  <ProductDetail />
                  <Footer />
                </>
              }
            />

            <Route
              path="/carrito"
              element={
                <>
                  <Header />
                  <Carrito />
                  <Footer />
                </>
              }
            />

            <Route
              path="/login"
              element={
                <>
                  <Header />
                  <LoginForm />
                  <Footer />
                </>
              }
            />

            <Route
              path="/login-admin"
              element={<AdminLoginForm />}
            />

            <Route
              path="/registro"
              element={
                <>
                  <Header />
                  <RegisterForm />
                  <Footer />
                </>
              }
            />

            {/* Recuperación de contraseña */}
            <Route
              path="/recuperar-password"
              element={
                <>
                  <Header />
                  <RecuperarPassword />
                  <Footer />
                </>
              }
            />

            <Route
              path="/restablecer-password"
              element={
                <>
                  <Header />
                  <RestablecerPassword />
                  <Footer />
                </>
              }
            />

            {/* Perfil de usuario */}
            <Route
              path="/perfil"
              element={
                <>
                  <Header />
                  <Perfil />
                  <Footer />
                </>
              }
            />

            <Route
              path="/401"
              element={
                <>
                  <Header />
                  <Unauthorized401 />
                  <Footer />
                </>
              }
            />

            <Route
              path="/terminos"
              element={
                <>
                  <Header />
                  <Terminos />
                  <Footer />
                </>
              }
            />

            <Route
              path="/privacidad"
              element={
                <>
                  <Header />
                  <Privacidad />
                  <Footer />
                </>
              }
            />

            <Route
              path="/soporte"
              element={
                <>
                  <Header />
                  <Soporte />
                  <Footer />
                </>
              }
            />

            <Route
              path="/contacto"
              element={
                <>
                  <Header />
                  <Contacto />
                  <Footer />
                </>
              }
            />

            {/* Rutas protegidas */}
            <Route
              path="/panel-secured"
              element={
                <ProtectedRoute requiredRole="admin">
                  <ProductsDashboard key="productos" />
                </ProtectedRoute>
              }
            />

            <Route
              path="/panel-secured/pedidos"
              element={
                <ProtectedRoute requiredRole="admin">
                  <ProductsDashboard
                    key="pedidos"
                    vistaInicial="pedidos"
                  />
                </ProtectedRoute>
              }
            />

            {/* Página no encontrada */}
            <Route
              path="*"
              element={<NotFound404 />}
            />

          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

