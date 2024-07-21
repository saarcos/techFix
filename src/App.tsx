import { Route, Routes } from "react-router-dom"
import Navbar from "./Components/Navbar"
import Productos from "./pages/Productos"
import Home from "./pages/Home"
import Tecnicos from "./pages/Tecnicos"
import Ordenes from "./pages/Ordenes"
import Clientes from "./pages/Clientes"
import { useAuth } from "./Components/AuthProvider"
import LoginForm from "./pages/LoginForm"
import SignupForm from "./pages/Signupform"
function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
     {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/" element={isAuthenticated ? <Home /> : <LoginForm />} />
        <Route path="/sign-up" element={<SignupForm />} />
        {isAuthenticated && (
          <>
            <Route path="/products" element={<Productos />} />
            <Route path="/taller/tecnicos" element={<Tecnicos />} />
            <Route path="/taller/ordenes" element={<Ordenes />} />
            <Route path="/taller/clientes" element={<Clientes />} />
          </>
        )}
      </Routes>
    </>
  )
}

export default App
