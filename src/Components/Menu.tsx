import { faBars, faBell, faListCheck,  faUserCircle, faSignOutAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"
import { useAuth } from "./AuthProvider"
import { useState } from "react";

interface Props {
    toggleNavbar: () => void;
    isNavbarVisible: boolean;
}
const Menu = ({toggleNavbar, isNavbarVisible}: Props) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const { logout, user } = useAuth(); // Usa el hook de autenticación para el logout y obtener el usuario
    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
      };    
  return (
    <header className={`fixed top-0 left-0 w-full lg:w-[calc(100%-256px)] ${isNavbarVisible ? 'lg:ml-64' : 'ml-0'} bg-gray-50 z-10`}>
        <div className="py-3 px-6 bg-white flex items-center shadow-md shadow-black/5">
            <button type="button" className="text-lg text-gray-600" onClick={toggleNavbar} >
                 <FontAwesomeIcon icon={faBars}/>
            </button>
            <ul className=" flex items-center text-sm ml-4">
                <li className="mr-2">
                    <Link to={"/"} className="text-gray-400 font-medium hover:text-gray-600"> Dashboard</Link>
                </li>
            </ul>
            <ul className="ml-auto flex items-center">
                <li className="mr-1">
                    <button type='button' 
                    className="text-gray-400 w-10 h-10 rounded flex items-center justify-center
                     hover:bg-gray-50 hover:text-gray-600">
                        <FontAwesomeIcon icon={faListCheck} />                    
                    </button>
                </li>
                <li className="mr-1">
                    <button type='button' 
                    className="text-gray-400 w-10 h-10 rounded flex items-center justify-center
                     hover:bg-gray-50 hover:text-gray-600">
                        <FontAwesomeIcon icon={faBell}/>
                    </button>
                </li>
                <li className="relative mr-1">
            <button type="button" onClick={toggleDropdown} className="text-gray-400 w-10 h-10 rounded flex items-center justify-center hover:bg-gray-50 hover:text-gray-600">
              <FontAwesomeIcon icon={faUserCircle} className="w-8 h-8" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
                {user && (
                  <div className="px-4 py-2 text-white border-b border-gray-200 flex items-center bg-customGray rounded-t-md">
                    <p className="text-customGreen mr-2">Bienvenido/a,</p> 
                    <span className="font-semibold">{user.nombre}</span>
                  </div>
                )}
                <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Perfil</Link>
                <button onClick={logout} className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 text-gray-400" />
                  Cerrar sesión
                </button>
              </div>
            )}
          </li>
                
            </ul>
        </div>
    </header>
  )
}

export default Menu