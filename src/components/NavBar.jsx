import { NavLink, Link, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../auth/useAuth";
import Logo from "./Logo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faXmark,
  faGear,
  faRightFromBracket,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

function navLinkClass({ isActive }) {
  return `nav-link ${isActive ? "nav-link-active" : ""}`;
}

function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const toggle = useCallback((e) => {
    e.stopPropagation?.();
    setOpen((v) => !v);
  }, []);
  const close = useCallback(() => setOpen(false), []);
  const toggleUser = useCallback((e) => {
    e.stopPropagation?.();
    setUserOpen((v) => !v);
  }, []);
  const closeUser = useCallback(() => setUserOpen(false), []);

  useEffect(() => {
    const onOutside = (e) => {
      const el = containerRef.current;
      if (el && !el.contains(e.target)) {
        close();
        closeUser();
      }
    };
    document.addEventListener("pointerdown", onOutside);
    return () => document.removeEventListener("pointerdown", onOutside);
  }, [close, closeUser]);

  const avatarUrl = user?.avatar || user?.photo || user?.image || null;
  const initials = (
    user?.name?.trim()?.[0] ||
    user?.email?.trim()?.[0] ||
    "U"
  ).toUpperCase();

  return (
    <header
      ref={containerRef}
      className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60"
    >
      <nav className="container-app flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Logo />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-2">
          <NavLink to="/locations" className={navLinkClass}>
            Sedes
          </NavLink>
          {user && (
            <NavLink to="/bookings/me" className={navLinkClass}>
              Mis reservas
            </NavLink>
          )}
          {user?.role === "admin" && (
            <NavLink to="/manage-bookings" className={navLinkClass}>
              Gestionar reservas
            </NavLink>
          )}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-2">
          {!user ? (
            <>
              <NavLink to="/login" className="btn-outline">
                Entrar
              </NavLink>
              <NavLink to="/register" className="btn-primary">
                Registrarse
              </NavLink>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={toggleUser}
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100"
                aria-expanded={userOpen}
                aria-haspopup="menu"
              >
                <span className="inline-flex w-8 h-8 rounded-full overflow-hidden ring-1 ring-gray-200 bg-gray-100 justify-center items-center">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={user.name || user.email}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm text-gray-700">{initials}</span>
                  )}
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {user.name || user.email}
                </span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="text-gray-500"
                />
              </button>

              {/* Dropdown */}
              {userOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg p-1"
                >
                  <button
                    onClick={() => {
                      closeUser();
                      navigate("/settings");
                    }}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faGear} />
                    <span>Configuración</span>
                  </button>
                  <button
                    onClick={() => {
                      closeUser();
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 flex items-center gap-2 text-red-600"
                  >
                    <FontAwesomeIcon icon={faRightFromBracket} />
                    <span>Salir</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden btn-ghost"
          aria-label="Abrir menú"
          aria-expanded={open}
          onClick={toggle}
        >
          <FontAwesomeIcon icon={open ? faXmark : faBars} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden border-t bg-white transition-[max-height,opacity] duration-200 overflow-hidden ${
          open ? "opacity-100 max-h-[480px]" : "opacity-0 max-h-0"
        }`}
      >
        <div className="container-app py-2 flex flex-col gap-1">
          <NavLink to="/locations" className={navLinkClass} onClick={close}>
            Sedes
          </NavLink>
          {user && (
            <NavLink to="/bookings/me" className={navLinkClass} onClick={close}>
              Mis reservas
            </NavLink>
          )}
          {user?.role === "admin" && (
            <NavLink
              to="/manage-bookings"
              className={navLinkClass}
              onClick={close}
            >
              Gestionar reservas
            </NavLink>
          )}

          <div className="pt-2 border-t mt-2" />

          {!user ? (
            <div className="flex items-center gap-2 pt-2">
              <NavLink to="/login" className="btn-outline" onClick={close}>
                Entrar
              </NavLink>
              <NavLink to="/register" className="btn-primary" onClick={close}>
                Registrarse
              </NavLink>
            </div>
          ) : (
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex w-9 h-9 rounded-full overflow-hidden ring-1 ring-gray-200 bg-gray-100 justify-center items-center">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm text-gray-700">{initials}</span>
                )}
              </span>
              <span className="text-sm font-medium text-gray-800 flex-1">
                {user.name || user.email}
              </span>
            </div>
          )}

          {user && (
            <div className="flex flex-col gap-1 pt-1">
              <button
                className="w-full text-left px-2 py-2 rounded-md hover:bg-gray-50 flex items-center gap-2"
                onClick={() => {
                  close();
                  navigate("/settings");
                }}
              >
                <FontAwesomeIcon icon={faGear} />
                <span>Configuración</span>
              </button>
              <button
                className="w-full text-left px-2 py-2 rounded-md hover:bg-gray-50 flex items-center gap-2 text-red-600"
                onClick={() => {
                  close();
                  logout();
                }}
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
                <span>Salir</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
