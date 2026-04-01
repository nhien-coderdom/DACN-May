import { Link } from "react-router-dom"

function Banner() {
  return (
    <section className="hero">
      <div className="hero-overlay">
        <div className="hero-content">
          <p className="hero-subtitle">MILK TEA</p>
          <h1>Hương vị trà đậm đà</h1>
          <p className="hero-desc">
            Thưởng thức các dòng trà sữa, trà trái cây với không gian
            thương hiệu sang trọng, tinh tế.
          </p>
          <Link to="/products" className="hero-btn">
              Khám phá menu
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Banner