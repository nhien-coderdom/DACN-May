import Header from '../components/Header'
import Footer from '../components/Footer'

function Cart() {
  return (
    <>
      <Header />

      <section className="cart-page">
        <div className="cart-container">
          <div className="section-title left">
            <p>Giỏ hàng</p>
            <h2>Sản phẩm đã chọn</h2>
          </div>

          <div className="cart-list">
            <div className="cart-item">
              <div className="cart-item-info">
                <h3>Trà sữa truyền thống</h3>
                <p>45.000đ</p>
              </div>

              <div className="cart-item-qty">
                <button>-</button>
                <span>1</span>
                <button>+</button>
              </div>
            </div>

            <div className="cart-item">
              <div className="cart-item-info">
                <h3>Trà đào</h3>
                <p>42.000đ</p>
              </div>

              <div className="cart-item-qty">
                <button>-</button>
                <span>1</span>
                <button>+</button>
              </div>
            </div>
          </div>

          <div className="cart-total">
            <h2>Tổng tiền: 87.000đ</h2>
            <button>Tiến hành thanh toán</button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default Cart