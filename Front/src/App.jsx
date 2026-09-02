import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Unauthorized401 from "./components/Unauthorized401";

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
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/registro" element={<RegisterForm />} />
          <Route path="/401" element={<Unauthorized401 />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;