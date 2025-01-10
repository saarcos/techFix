import { faBars, faBell, faUserCircle, faSignOutAlt, faKey } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { useEffect, useRef, useState } from "react";
import { Notificacion, readNotification } from "@/api/notificacionesService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BellRing } from "lucide-react";

interface Props {
  toggleNavbar: () => void;
  isNavbarVisible: boolean;
}

const Menu = ({ toggleNavbar, isNavbarVisible }: Props) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
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

  const updateNotificationMutation = useMutation({
    mutationFn: (id_notificacion: number) => readNotification(id_notificacion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificaciones"] });
    },
    onError: (error) => {
      console.error("Error al actualizar notificación:", error);
    },
  });

  const handleNotificationClick = (notificacion: Notificacion) => {
    updateNotificationMutation.mutate(notificacion.id_notificacion);
    setDropdownOpen(false);
    navigate(`taller/ordenes/${notificacion.id_referencia}/edit`);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full lg:w-[calc(100%-256px)] ${isNavbarVisible ? "lg:ml-64" : "ml-0"} bg-gray-50 z-10`}
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
              <span className="font-semibold">Bienvenido/a,</span> {user.nombre}
            </p>
          )}
          <div className="relative" ref={notificationsRef}>
            <button
              type="button"
              onClick={toggleNotifications}
              className="text-gray-400 w-10 h-10 rounded flex items-center justify-center hover:bg-gray-50 hover:text-gray-600 relative"
            >
              <FontAwesomeIcon icon={faBell} className="w-5 h-5" />
              {notificaciones && notificaciones.length > 0 && (
                <span className="absolute top-1 right-1 bg-customGreen text-black text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {notificaciones.length}
                </span>
              )}
            </button>
            {isNotificationsOpen && (
              <div
                className="absolute top-full mt-2 sm:right-0 left-3 sm:left-auto transform sm:translate-x-0 -translate-x-1/2 min-w-[16rem] max-w-[90%] sm:max-w-[20rem] bg-white rounded-md  py-2 z-20 max-h-96 overflow-y-auto"
              >
                <div className="px-3 py-2 flex justify-between items-center border-b bg-customGray">
                  <p className="text-sm font-semibold text-white bg-cust">Notificaciones</p>
                  {notificaciones && notificaciones.length > 0 && (
                    <button
                      className="text-sm text-customGreen hover:underline"
                      onClick={() =>
                        notificaciones.forEach((n) =>
                          updateNotificationMutation.mutate(n.id_notificacion)
                        )
                      }
                    >
                      Leer todas
                    </button>
                  )}
                </div>
                {notificaciones && notificaciones.length > 0 ? (
                  <div className="px-3 py-2">
                    {notificaciones.map((notificacion) => (
                      <div
                        key={notificacion.id_notificacion}
                        className="flex items-start gap-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer p-2 border-b"
                        onClick={() => handleNotificationClick(notificacion)}
                      >
                        <div className="flex items-center justify-center w-5 h-5 mt-2.5">
                          <BellRing className="w-5 h-5 text-customGreen" />
                        </div>
                        <div className="text-sm">
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
                  <p className="px-4 py-2 text-sm text-gray-500">No tienes notificaciones.</p>
                )}
              </div>
            )}
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={toggleDropdown}
              className="text-gray-400 w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-100 hover:text-gray-600 ml-3"
            >
              <FontAwesomeIcon icon={faUserCircle} className="w-10 h-10" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg border border-gray-200 z-20">
                {user && (
                  <div className="px-4 py-3 text-white border-b border-gray-200 flex flex-col items-start bg-customGray rounded-t-lg">
                    <p className="text-customGreen font-semibold">{user.nombre} {user.apellido}</p>
                    <span className="text-sm text-gray-400">Rol: {user.rol}</span>
                  </div>
                )}
                <Link
                  to="/cambiar-contrasena"
                  className="flex items-center w-full text-left px-4 py-3 text-gray-800 hover:bg-gray-100 rounded-md"
                >
                  <FontAwesomeIcon icon={faKey} className="mr-3 text-gray-400" />
                  <span className="text-sm font-medium">Cambiar contraseña</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center w-full text-left px-4 py-3 text-gray-800 hover:bg-gray-100 rounded-md"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 text-gray-400" />
                  <span className="text-sm font-medium">Cerrar sesión</span>
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
