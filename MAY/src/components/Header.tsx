import { Link } from 'react-router-dom'
import { FaShoppingCart } from 'react-icons/fa'

function Header() {
  return (
    <header className="header">
      <div className="logo">MAY TEA</div>

      <nav className="nav">
        <Link to="/">Trang chủ</Link>
        <Link to="/products">Sản phẩm</Link>
        <Link to="/about">Giới thiệu</Link>
        <Link to="/login">Đăng nhập</Link>
        <Link to="/cart" className="cart-icon">
          <FaShoppingCart />
        </Link>
      </nav>
    </header>
  )
}

export default Header