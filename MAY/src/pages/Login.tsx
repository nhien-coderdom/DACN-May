import { Link } from 'react-router-dom'
import Header from '../components/Header'

function Login() {
  return (
    <>
      <Header />

      <section className="auth-page">
        <div className="auth-container">
          <h1>Đăng nhập</h1>

          <form className="auth-form">
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Mật khẩu" />
            <button type="submit">Đăng nhập</button>
          </form>

          <p className="auth-switch">
            Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
          </p>
        </div>
      </section>

    </>
  )
}

export default Login