import Header from '../components/Header'
import Footer from '../components/Footer'

function ProductDetail() {
  return (
    <>
      <Header />

      <section className="detail-page">
        <div className="detail-container">
          <div className="detail-image">
            <img
              src="https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=1000&q=80"
              alt="Trà sữa truyền thống"
            />
          </div>

          <div className="detail-info">
            <p className="detail-label">Chi tiết sản phẩm</p>
            <h1>Trà sữa truyền thống</h1>
            <p className="detail-price">45.000đ</p>
            <p className="detail-desc">
              Hương vị trà đậm đà kết hợp cùng sữa thơm béo, mang đến trải
              nghiệm thưởng thức cân bằng và dễ uống.
            </p>

            <div className="detail-options">
              <div className="option-box">Size M</div>
              <div className="option-box">Ít đường</div>
              <div className="option-box">Thêm trân châu</div>
            </div>

            <button>Thêm vào giỏ hàng</button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default ProductDetail