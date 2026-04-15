import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FiUser, FiLogOut } from "react-icons/fi";

function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isProductActive = location.pathname.startsWith("/products") || location.pathname.startsWith("/product");

  return (
    <header className="w-full px-6 py-4 bg-[#6c935b] absolute top-0 left-0 z-50">
  <div className="flex items-center justify-between">

    {/* Logo */}
    <div className="flex items-center gap-2">
      <img
        src="../src/assets/may_logo.png"
        alt="May Logo"
        className="w-45 object-contain"
      />
    </div>

    {/* NAV */}
    <nav className="absolute left-1/2 -translate-x-1/2">
      <div className="flex items-center gap-4 rounded-full bg-white/70 px-4 py-2 shadow-md backdrop-blur-md border border-white/40">

        {/* Home */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive
              ? "rounded-full bg-[#e1c8c8] px-4 py-1 text-[#4f6f41] font-semibold scale-105 transition-all duration-300"
              : "px-4 py-1 text-neutral-700 hover:text-neutral-900 hover:bg-orange-50 rounded-full transition-all duration-300 hover:scale-105"
          }
        >
          Home
        </NavLink>

        {/* Product */}
        <NavLink
          to="/products"
          className={
            isProductActive
              ? "rounded-full bg-[#e1c8c8] px-4 py-1 text-[#4f6f41] font-semibold scale-105 transition-all duration-300"
              : "px-4 py-1 text-neutral-700 hover:text-neutral-900 hover:bg-orange-50 rounded-full transition-all duration-300 hover:scale-105"
          }
        >
          Product
        </NavLink>

        {/* About */}
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive
              ? "rounded-full bg-[#e1c8c8] px-4 py-1 text-[#4f6f41] font-semibold scale-105 transition-all duration-300"
              : "px-4 py-1 text-neutral-700 hover:text-neutral-900 hover:bg-orange-50 rounded-full transition-all duration-300 hover:scale-105"
          }
        >
          About
        </NavLink>

        {/* Cart */}
        <NavLink
          to="/cart"
          className={({ isActive }) =>
            isActive
              ? "rounded-full bg-[#e1c8c8] px-4 py-1 text-[#4f6f41] font-semibold scale-105 transition-all duration-300"
              : "px-4 py-1 text-neutral-700 hover:text-neutral-900 hover:bg-orange-50 rounded-full transition-all duration-300 hover:scale-105"
          }
        >
          Cart
        </NavLink>

      </div>
    </nav>

    {/* RIGHT */}
    <div className="flex items-center gap-3">
      {user ? (
        <>
          <NavLink
            to="/profile"
            className="flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-[#086136] shadow-sm hover:bg-orange-100 transition"
          >
            <FiUser size={16} />
            <span className="hidden sm:inline">
              {user.name?.split(" ").pop() || "Profile"}
            </span>
          </NavLink>

          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-[#086136] shadow-sm hover:bg-red-100 transition"
          >
            <FiLogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </>
      ) : (
        <NavLink
          to="/login"
          className="rounded-full bg-linear-to-r bg-[#086136] px-5 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          Login / Register
        </NavLink>
      )}
    </div>

  </div>
</header>
  );
}

export default Header;