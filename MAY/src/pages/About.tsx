import Header from '../components/Header'
import Footer from '../components/Footer'

function About() {
  return (
    <>
      <Header />

      <section className="about-page">
        <div className="about-page-container">
          <div className="about-page-text">
            <p className="about-label">Về thương hiệu</p>
            <h1>Câu chuyện của MAY TEA</h1>
            <p>
              MAY TEA mang đến trải nghiệm trà sữa thơm ngon đậm vị với
              nguyên liệu chọn lọc và chất lượng phục vụ tận tâm.
            </p>
            <p>
              Chúng tôi tin rằng mỗi ly trà không chỉ là thức uống mà còn là một
              trải nghiệm tinh tế trong từng khoảnh khắc.
            </p>
          </div>

          <div className="about-page-image">
            <img
              src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80"
              alt="About MAY TEA"
            />
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default About