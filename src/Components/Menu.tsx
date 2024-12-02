import { faBars, faBell, faUserCircle, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { useEffect, useRef, useState } from "react";
import { Notificacion, readNotification } from "@/api/notificacionesService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BellRing} from "lucide-react";

interface Props {
  toggleNavbar: () => void;
  isNavbarVisible: boolean;
}

const Menu = ({ toggleNavbar, isNavbarVisible }: Props) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false); // Estado para notificaciones
  const { logout, user, notificaciones } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  const toggleNotifications = () => {
    setNotificationsOpen(!isNotificationsOpen);
  };
  // Detecta clics fuera de los dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // Mutation para marcar una notificación como leída
  const updateNotificationMutation = useMutation({
    mutationFn: (id_notificacion: number) => readNotification(id_notificacion), // Servicio para marcar como leída
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificaciones"] }); // Invalidar las notificaciones en caché
    },
    onError: (error) => {
      console.error("Error al actualizar notificación:", error);
    },
  });
  // Manejar clic en una notificación
  const handleNotificationClick = (notificacion: Notificacion) => {
    updateNotificationMutation.mutate(notificacion.id_notificacion); // Ejecutar la mutación
    navigate(`taller/ordenes/${notificacion.id_referencia}`); // Redirigir al usuario
  };
  return (
    <header
      className={`fixed top-0 left-0 w-full lg:w-[calc(100%-256px)] ${isNavbarVisible ? "lg:ml-64" : "ml-0"
        } bg-gray-50 z-10`}
    >
      <div className="py-1.5 px-6 bg-white flex items-center shadow-md shadow-black/5">
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
          <div className="relative" ref={notificationsRef}>
            <button
              type="button"
              onClick={toggleNotifications}
              className="text-gray-400 w-10 h-10 rounded flex items-center justify-center hover:bg-gray-50 hover:text-gray-600 relative"
            >
              <FontAwesomeIcon icon={faBell} className="w-5 h-5" />
              {/* Badge de notificaciones no leídas */}
              {notificaciones && notificaciones.length > 0 && (
                <span className="absolute top-1 right-1 bg-customGreen text-black text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {notificaciones.length}
                </span>
              )}
            </button>
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-2 z-20">
                <div className="px-4 py-2 flex justify-between items-center border-b">
                  <p className="text-sm font-semibold text-gray-700">Notificaciones</p>
                  {notificaciones && notificaciones.length > 0 && (
                    <button
                      className="text-xs text-customGreen hover:underline"
                      onClick={() =>
                        notificaciones.forEach(n =>
                          updateNotificationMutation.mutate(n.id_notificacion)
                        )
                      }
                    >
                      Marcar todas como leídas
                    </button>
                  )}
                </div>
                {notificaciones && notificaciones.length > 0 ? (
                  <div className="max-h-72 overflow-y-auto">
                    {/* Lista de notificaciones */}
                    {notificaciones.map(notificacion => (
                      <div
                        key={notificacion.id_notificacion}
                        className="px-4 py-2 flex items-start gap-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleNotificationClick(notificacion)}
                      >
                        {/* Ícono de Lucide */}
                        <div className="flex items-center justify-center w-5 h-5 mt-2.5">
                          <BellRing className="w-5 h-5 text-customGreen"/>
                        </div>
                        <div>
                          <p>{notificacion.mensaje}</p>
                          <span className="text-xs text-gray-500">
                            {new Date(notificacion.created_at).toLocaleString(undefined, {
                              dateStyle: "short",
                              timeStyle: "short",
                            })}                          
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="px-4 py-2 text-sm text-gray-500">
                    No tienes notificaciones.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={toggleDropdown}
              className="text-gray-400 w-10 h-10 rounded flex items-center justify-center hover:bg-gray-50 hover:text-gray-600 ml-3"
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
