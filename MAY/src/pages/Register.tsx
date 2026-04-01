import { Link } from 'react-router-dom'
import Header from '../components/Header'

function Register() {
  return (
    <>
      <Header />

      <section className="auth-page">
        <div className="auth-container">
          <h1>Đăng ký</h1>

          <form className="auth-form">
            <input type="text" placeholder="Họ và tên" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Mật khẩu" />
            <input type="password" placeholder="Nhập lại mật khẩu" />
            <button type="submit">Tạo tài khoản</button>
          </form>

          <p className="auth-switch">
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </p>
        </div>
      </section>

    </>
  )
}

export default Register