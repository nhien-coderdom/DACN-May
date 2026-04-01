import Header from '../components/Header'
import Footer from '../components/Footer'

function Checkout() {
  return (
    <>
      <Header />

      <section className="checkout-page">
        <div className="checkout-container">
          <div className="section-title left">
            <p>Thanh toán</p>
            <h2>Thông tin đơn hàng</h2>
          </div>

          <div className="checkout-layout">
            <form className="checkout-form">
              <input type="text" placeholder="Họ và tên" />
              <input type="text" placeholder="Số điện thoại" />
              <input type="text" placeholder="Địa chỉ nhận hàng" />
              <textarea placeholder="Ghi chú đơn hàng"></textarea>
              <button type="submit">Đặt hàng</button>
            </form>

            <div className="checkout-summary">
              <h3>Tóm tắt đơn hàng</h3>
              <p>Trà sữa truyền thống x1</p>
              <p>Trà đào x1</p>
              <hr />
              <h4>Tổng cộng: 87.000đ</h4>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default Checkout