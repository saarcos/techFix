import { Link, useLocation } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTools, faBox, faWarehouse, faGear, faChevronDown, faHouseChimney, faPersonDigging, faPeopleGroup, faLayerGroup, faHandsHelping, faBoxesStacked, faBriefcase, faBarsProgress, faTasks, faCheckCircle, faPlug } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import useWindowSize from '../hooks/useWindowSize'; // Asegúrate de importar el hook
import { useAuth } from "./AuthProvider";
import { MonitorSmartphone } from "lucide-react";
interface Props {
  isVisible: boolean;
  toggleNavbar: () => void;
}
const Navbar = ({ isVisible, toggleNavbar }: Props) => {
  const location = useLocation();
  const { width } = useWindowSize();
  const { isAuthenticated, user } = useAuth();
  const getLinkClass = (path: string) => {
    return location.pathname === path
      ? "flex items-center text-black py-2 px-4 bg-customGreen rounded-full"
      : "flex items-center text-gray-300 py-2 px-4 hover:bg-gray-950 hover:text-gray-100 rounded-full";
  };
  const handleLinkClick = () => {
    if (width < 1024) {
      toggleNavbar();
    }
  };
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isTasksDropdownOpen, setIsTasksDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  const toggleProductsDropdown = () => {
    setIsProductsDropdownOpen(!isProductsDropdownOpen);
  };
  const toggleServicesDropdown = () => {
    setIsServicesDropdownOpen(!isServicesDropdownOpen);
  };
  const toggleTasksDropdown = () => {
    setIsTasksDropdownOpen(!isTasksDropdownOpen);
  };
  return (
    <div className={`fixed left-0 top-0 w-64 h-full bg-customGray p-4 font-inter transition-transform transform ${isVisible ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 z-50`}>
      <Link to="/" className="flex items-center pb-4 border-b border-b-gray-600 align-middle">
        <FontAwesomeIcon icon={faGear} className='w-8 h-8 text-customGreen' />
        <span className="text-md font-bold text-customGreen  ml-3"> TechFix Manager</span>
      </Link>
      <ul className="mt-4">
        <li className="mb-2 ">
          <Link to="/" className={getLinkClass("/")} onClick={handleLinkClick}>
            <FontAwesomeIcon icon={faHouseChimney} className="mr-3 text-lg" />
            <span className="text-sm">Inicio</span>
          </Link>
        </li>
        <li className="mb-2">
          <div className='flex items-center text-gray-300 py-2 px-4 hover:bg-gray-950 hover:text-gray-100 rounded-full cursor-pointer' onClick={toggleDropdown}>
            <FontAwesomeIcon icon={faTools} className="mr-3 text-lg" />
            <span className="text-sm">Taller</span>
            <FontAwesomeIcon icon={faChevronDown}
              className={`ml-auto text-sm transition-transform duration-700 transform ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
            />
          </div>
          {isDropdownOpen && (
            <ul className="left-0 mt-2 ml-4 w-48 bg-gray-800 rounded-lg overflow-hidden">
              <li>
                <Link
                  to="/taller/ordenes"
                  className={`${getLinkClass("/taller/ordenes")}`}
                  onClick={handleLinkClick}
                >
                  <FontAwesomeIcon icon={faBriefcase} />
                  <span className="text-sm ml-1">Órdenes de trabajo</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/taller/clientes"
                  className={`${getLinkClass("/taller/clientes")}`}
                  onClick={handleLinkClick}
                >
                  <FontAwesomeIcon icon={faPeopleGroup} />
                  <span className="text-sm ml-1">Clientes</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/taller/equipos"
                  className={`${getLinkClass("/taller/equipos")}`}
                  onClick={handleLinkClick}
                >
                  <MonitorSmartphone />
                  <span className="text-sm ml-1">Equipos</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/taller/accesorios"
                  className={`${getLinkClass("/taller/accesorios")}`}
                  onClick={handleLinkClick}
                >
                  <FontAwesomeIcon icon={faPlug} />
                  <span className="text-sm ml-1">Accesorios</span>
                </Link>
              </li>
              {
                isAuthenticated && user && user?.id_rol === 1 && (
                  <>
                    <li>
                      <Link
                        to="/taller/tecnicos"
                        className={`${getLinkClass("/taller/tecnicos")}`}
                        onClick={handleLinkClick}
                      >
                        <FontAwesomeIcon icon={faPersonDigging} />
                        <span className="text-sm ml-1">Usuarios del sistema</span>
                      </Link>
                    </li>
                  </>
                )
              }
            </ul>
          )}
        </li>
        <li className="mb-2 ">
          <div className='flex items-center text-gray-300 py-2 px-4 hover:bg-gray-950 hover:text-gray-100 rounded-full cursor-pointer' onClick={toggleProductsDropdown}>
            <FontAwesomeIcon icon={faBox} className="mr-3 text-lg" />
            <span className="text-sm">Productos</span>
            <FontAwesomeIcon icon={faChevronDown}
              className={`ml-auto text-sm transition-transform duration-700 transform ${isProductsDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
            />
          </div>
          {isProductsDropdownOpen && (
            <ul className="left-0 mt-2 ml-4 w-48 bg-gray-800 rounded-lg overflow-hidden">
              <li>
                <Link
                  to="/taller/productos"
                  className={`${getLinkClass("/taller/productos")}`}
                  onClick={handleLinkClick}
                >
                  <FontAwesomeIcon icon={faBoxesStacked} />
                  <span className="text-sm ml-1">Administrar</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/taller/categoriaProductos"
                  className={`${getLinkClass("/taller/categoriaProductos")}`}
                  onClick={handleLinkClick}
                >
                  <FontAwesomeIcon icon={faLayerGroup} />
                  <span className="text-sm ml-1">Categorías</span>
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li className="mb-2 ">
          <div className='flex items-center text-gray-300 py-2 px-4 hover:bg-gray-950 hover:text-gray-100 rounded-full cursor-pointer' onClick={toggleServicesDropdown}>
            <FontAwesomeIcon icon={faHandsHelping} className="mr-3 text-lg" />
            <span className="text-sm">Servicios</span>
            <FontAwesomeIcon icon={faChevronDown}
              className={`ml-auto text-sm transition-transform duration-700 transform ${isServicesDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
            />
          </div>
          {isServicesDropdownOpen && (
            <ul className="left-0 mt-2 ml-4 w-48 bg-gray-800 rounded-lg overflow-hidden">
              <li>
                <Link
                  to="/taller/servicios"
                  className={`${getLinkClass("/taller/servicios")}`}
                  onClick={handleLinkClick}
                >
                  <FontAwesomeIcon icon={faBoxesStacked} />
                  <span className="text-sm ml-1">Administrar </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/taller/categoriaServicios"
                  className={`${getLinkClass("/taller/categoriaServicios")}`}
                  onClick={handleLinkClick}
                >
                  <FontAwesomeIcon icon={faLayerGroup} />
                  <span className="text-sm ml-1">Categorías</span>
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li className="mb-2 ">
          <div className='flex items-center text-gray-300 py-2 px-4 hover:bg-gray-950 hover:text-gray-100 rounded-full cursor-pointer' onClick={toggleTasksDropdown}>
            <FontAwesomeIcon icon={faCheckCircle} className="mr-3 text-lg" />
            <span className="text-sm">Tareas</span>
            <FontAwesomeIcon icon={faChevronDown}
              className={`ml-auto text-sm transition-transform duration-700 transform ${isTasksDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
            />
          </div>
          {isTasksDropdownOpen && (
            <ul className="left-0 mt-2 ml-4 w-48 bg-gray-800 rounded-lg overflow-hidden">
              <li>
                <Link to="/taller/plantillaTareas" className={getLinkClass("/taller/plantillaTareas")} onClick={handleLinkClick}>
                  <FontAwesomeIcon icon={faBarsProgress} className="mr-3 text-lg" />
                  <span className="text-sm">Plantillas</span>
                </Link>
              </li>
              <li>
                <Link to="/taller/tareas" className={getLinkClass("/taller/tareas")} onClick={handleLinkClick}>
                  <FontAwesomeIcon icon={faTasks} className="mr-3 text-lg" />
                  <span className="text-sm">Tareas</span>
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li className="mb-2">
          <Link to="/" className="flex items-center text-gray-300 py-2 px-4 hover:bg-gray-950 hover:text-gray-100  rounded-full" onClick={handleLinkClick}>
            <FontAwesomeIcon icon={faWarehouse} className="mr-3 text-lg" />
            <span className="text-sm">Inventario</span>
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default Navbar