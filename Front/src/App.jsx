import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AssetsProvider } from "./context/AssetsContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Unauthorized401 from "./components/Unauthorized401";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AssetsProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/registro" element={<RegisterForm />} />
            <Route path="/401" element={<Unauthorized401 />} />
          </Routes>
          <Footer />
        </AssetsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
