import { Route, Routes } from "react-router-dom"
import Navbar from "./Components/Navbar"
import Productos from "./pages/Productos"
import Home from "./pages/Home"
import Tecnicos from "./pages/Tecnicos"
import Ordenes from "./pages/Ordenes"
import Clientes from "./pages/Clientes"
function App() {

  return (
    <>
     <Navbar/>
     <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/products" element={<Productos/>}></Route>
      <Route path="/taller/tecnicos" element={<Tecnicos/>}></Route>
      <Route path="/taller/ordenes" element={<Ordenes/>}></Route>
      <Route path="/taller/clientes" element={<Clientes/>}></Route>
     </Routes>
    </>
  )
}

export default App
