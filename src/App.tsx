import { Route, Routes, Navigate} from "react-router-dom"
import Navbar from "./Components/Navbar"
import Productos from "./pages/Productos"
import Home from "./pages/Home"
import Tecnicos from "./pages/Tecnicos"
import Ordenes from "./pages/Ordenes"
import Clientes from "./pages/Clientes"
import { useAuth } from "./Components/AuthProvider"
import LoginForm from "./pages/LoginForm"
import SignupForm from "./pages/Signupform"
import ProtectedRoute from "./Components/ProtectedRoute"
import Menu from "./Components/Menu"
import { useEffect, useState } from "react"
import { Toaster } from "sonner"

function App() {
  const { isAuthenticated } = useAuth();
  const [isNavbarVisible, setNavbarVisible] = useState(true);
  const toggleNavbar = () => {
    setNavbarVisible(!isNavbarVisible);
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setNavbarVisible(false);
      } else {
        setNavbarVisible(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Llamada inicial para establecer el estado correcto

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <Toaster position="top-center" richColors  />
      {isAuthenticated && <Menu toggleNavbar={toggleNavbar} isNavbarVisible={isNavbarVisible} />}
      {isAuthenticated && <Navbar isVisible={isNavbarVisible} toggleNavbar={toggleNavbar} />}
      {isNavbarVisible && window.innerWidth < 1024 && (
            <div className="fixed top-0 left-64 right-0 bottom-0 bg-black opacity-50 z-10" onClick={toggleNavbar}></div>
      )}
      <div className={`${isAuthenticated ? 'pt-16 transition-all duration-300' : ''} ${isAuthenticated && isNavbarVisible ? 'lg:ml-64' : 'ml-0'}`}>
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginForm />} />
          <Route path="/sign-up" element={isAuthenticated ? <Navigate to="/" /> : <SignupForm />} />
          <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
          <Route path="/products" element={<ProtectedRoute><Productos /></ProtectedRoute>} />
          <Route path="/taller/tecnicos" element={<ProtectedRoute><Tecnicos /></ProtectedRoute>} />
          <Route path="/taller/ordenes" element={<ProtectedRoute><Ordenes /></ProtectedRoute>} />
          <Route path="/taller/clientes" element={<ProtectedRoute><Clientes /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
}

export default App
