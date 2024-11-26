import { faBars, faBell, faUserCircle, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { useEffect, useRef, useState } from "react";

interface Props {
  toggleNavbar: () => void;
  isNavbarVisible: boolean;
}

const Menu = ({ toggleNavbar, isNavbarVisible }: Props) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const { logout, user } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };
    // Detecta clics fuera del dropdown
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setDropdownOpen(false);
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
  return (
    <header
      className={`fixed top-0 left-0 w-full lg:w-[calc(100%-256px)] ${
        isNavbarVisible ? "lg:ml-64" : "ml-0"
      } bg-gray-50 z-10`}
    >
      <div className="py-3 px-6 bg-white flex items-center shadow-md shadow-black/5">
        {!isNavbarVisible && (
          <button
            type="button"
            className="text-lg text-gray-600"
            onClick={toggleNavbar}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        )}
        <ul className="flex items-center text-sm ml-4">
          <li className="mr-2">
            <Link
              to="/"
              className="text-gray-400 font-medium hover:text-gray-600 text-lg"
            >
              Dashboard
            </Link>
          </li>
        </ul>
        <div className="ml-auto flex items-center">
          {user && (
            <p className="hidden sm:block text-sm text-gray-600 mr-4">
              <span className="font-semibold">Bienvenido/a,</span>{" "}
              {user.nombre} 
            </p>
          )}
          <button
            type="button"
            className="text-gray-400 w-10 h-10 rounded flex items-center justify-center hover:bg-gray-50 hover:text-gray-600"
          >
            <FontAwesomeIcon icon={faBell} />
          </button>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={toggleDropdown}
              className="text-gray-400 w-10 h-10 rounded flex items-center justify-center hover:bg-gray-50 hover:text-gray-600"
            >
              <FontAwesomeIcon icon={faUserCircle} className="w-8 h-8" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
                {user && (
                  <div className="px-3 py-2 text-white border-b border-gray-200 flex items-center bg-customGray rounded-t-md">
                    <p className="text-customGreen mr-1">Bienvenido/a,</p>
                    <span className="font-semibold">{user.nombre}</span>
                  </div>
                )}
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Perfil
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    className="mr-2 text-gray-400"
                  />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Menu;
