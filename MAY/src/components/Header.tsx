import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FiUser, FiLogOut } from "react-icons/fi";

function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isProductActive = location.pathname.startsWith("/products") || location.pathname.startsWith("/product");

  return (
    <header className="flex flex-col items-center justify-between gap-4 pb-4 sm:flex-row sm:gap-0">
      <div className="flex items-center gap-2 font-extrabold text-neutral-900">
        <span className="text-3xl sm:text-4xl">☕</span>
        <span className="text-2xl sm:text-3xl">
          M<span className="text-orange-400">AY</span>
        </span>
      </div>

      <nav className="flex w-full justify-center gap-6 text-base font-medium text-neutral-600 sm:w-auto sm:gap-8 sm:text-lg">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive
              ? "border-b-2 border-orange-400 pb-2 text-neutral-900"
              : "pb-2 transition hover:text-neutral-900"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/products"
          className={
            isProductActive
              ? "border-b-2 border-orange-400 pb-2 text-neutral-900"
              : "pb-2 transition hover:text-neutral-900"
          }
        >
          Product
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive
              ? "border-b-2 border-orange-400 pb-2 text-neutral-900"
              : "pb-2 transition hover:text-neutral-900"
          }
        >
          About
        </NavLink>

        <NavLink
          to="/cart"
          className={({ isActive }) =>
            isActive
              ? "border-b-2 border-orange-400 pb-2 text-neutral-900"
              : "pb-2 transition hover:text-neutral-900"
          }
        >
          Cart
        </NavLink>
      </nav>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <NavLink
              to="/profile"
              className="flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-100"
            >
              <FiUser size={16} />
              <span className="hidden sm:inline">
                {user.name?.split(" ").pop() || "Profile"}
              </span>
            </NavLink>

            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              <FiLogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        ) : (
          <NavLink
            to="/login"
            className="rounded-full bg-orange-400 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-orange-500 hover:shadow-lg"
          >
            Login/Register
          </NavLink>
        )}
      </div>
    </header>
  );
}

export default Header;