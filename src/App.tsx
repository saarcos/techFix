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
function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <Menu />} 
      {isAuthenticated && <Navbar />} 
      <Routes>
        <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/" /> : <LoginForm />} 
          />
          <Route 
            path="/sign-up" 
            element={isAuthenticated ? <Navigate to="/" /> : <SignupForm />} 
          />
      </Routes>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Home /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Productos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/taller/tecnicos"
          element={
            <ProtectedRoute>
              <Tecnicos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/taller/ordenes"
          element={
            <ProtectedRoute>
              <Ordenes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/taller/clientes"
          element={
            <ProtectedRoute>
              <Clientes />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App
