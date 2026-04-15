import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiCoffee, FiHeart, FiStar, FiFeather } from "react-icons/fi";
import aboutMay from "../assets/about-may.png";

function About() {
  const navigate = useNavigate();

  const highlights = [
    {
      icon: <FiCoffee size={20} />,
      title: "Nguyên liệu chọn lọc",
      description:
        "Mỗi sản phẩm được chuẩn bị từ nguyên liệu chất lượng, giữ trọn hương vị tươi mới và cảm giác cân bằng trong từng ly nước.",
    },
    {
      icon: <FiHeart size={20} />,
      title: "Trải nghiệm tận tâm",
      description:
        "MAY mong muốn mỗi lần khách hàng ghé thăm đều là một trải nghiệm dễ chịu, tinh tế và đáng nhớ.",
    },
    {
      icon: <FiStar size={20} />,
      title: "Hương vị đặc trưng",
      description:
        "Chúng tôi kết hợp sự quen thuộc với tinh thần sáng tạo để tạo nên những thức uống trẻ trung, thanh lịch và dễ yêu thích.",
    },
  ];

  const values = [
    {
      title: "Tinh tế trong từng chi tiết",
      description:
        "Từ hình ảnh, hương vị đến trải nghiệm mua hàng, MAY theo đuổi sự chỉn chu để tạo nên cảm giác cao cấp nhưng vẫn gần gũi.",
    },
    {
      title: "Lan tỏa niềm vui mỗi ngày",
      description:
        "Chúng tôi mong muốn mỗi ly nước MAY là một khoảnh khắc nhỏ nhưng tích cực, giúp ngày của khách hàng trở nên nhẹ nhàng hơn.",
    },
    {
      title: "Trẻ trung nhưng vẫn sang",
      description:
        "MAY mang tinh thần hiện đại, tối giản và đầy cảm hứng, hướng đến một phong cách sống trẻ nhưng vẫn tinh tế.",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 lg:px-8">
      <section className="relative rounded-[36px] bg-gradient-to-br from-white via-orange-50/30 to-neutral-100 px-6 py-10 shadow-xl md:px-10 md:py-14 lg:px-14">
        <div className="absolute -right-8 top-0 h-40 w-40 rounded-full bg-orange-200/20 blur-3xl" />
        <div className="absolute -left-8 bottom-0 h-40 w-40 rounded-full bg-orange-300/10 blur-3xl" />

        <div className="relative grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-orange-400">
              About MAY
            </p>

            <h1 className="max-w-2xl font-serif text-[clamp(32px,4vw,60px)] font-black leading-[1.15] text-neutral-900">
              Tạo nên những ly nước đẹp và thơm ngon.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-neutral-600 md:text-lg">
              MAY được xây dựng với mong muốn mang đến trải nghiệm đồ uống hiện đại,
              chỉn chu và giàu cảm xúc. Chúng tôi tin rằng một ly nước ngon không chỉ
              nằm ở hương vị, mà còn ở cách nó khiến ngày của bạn trở nên dễ chịu hơn.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/products")}
                className="rounded-full bg-[#6c935b] px-6 py-3 text-sm font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-[2px] hover:bg-orange-500 hover:shadow-lg"
              >
                Khám phá menu
              </button>

              <button
                onClick={() => navigate("/")}
                className="rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-700 transition-all duration-300 hover:border-neutral-400 hover:bg-neutral-50 hover:shadow-sm"
              >
                Về trang chủ
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[32px] shadow-2xl">
              <img
                src={aboutMay}
                alt="About MAY"
                className="h-[300px] w-full object-cover transition-transform duration-700 hover:scale-[1.03] md:h-[420px]"
              />
            </div>

            <div className="absolute -bottom-5 left-4 rounded-[24px] bg-white/95 px-5 py-4 shadow-lg backdrop-blur md:left-6">
              <p className="text-sm font-semibold text-neutral-900">Từ năm 2022</p>
              <p className="mt-1 text-sm text-neutral-500">
                Xây dựng trải nghiệm đồ uống trẻ trung và tinh tế
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[32px] bg-white p-8 shadow-lg transition-shadow duration-300 hover:shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
            Our Story
          </p>

          <h2 className="mt-3 text-3xl font-black text-neutral-900">
            Câu chuyện của MAY
          </h2>

          <div className="mt-6 space-y-4 leading-8 text-neutral-600">
            <p>
              Bắt đầu từ niềm yêu thích với những thức uống được chuẩn bị chỉn chu,
              MAY ra đời với mong muốn mang đến một thương hiệu vừa gần gũi, vừa hiện đại,
              nơi mỗi sản phẩm đều được đầu tư từ hương vị đến cảm giác khi thưởng thức.
            </p>

            <p>
              Chúng tôi theo đuổi phong cách tối giản nhưng tinh tế, tập trung vào
              chất lượng nguyên liệu, sự cân bằng trong công thức và trải nghiệm nhẹ nhàng,
              dễ chịu cho khách hàng.
            </p>

            <p>
              Với MAY, mỗi ly nước không chỉ là một sản phẩm, mà còn là một phần của
              lối sống trẻ trung, tích cực và đầy cảm hứng.
            </p>
          </div>
        </div>

        <div className="rounded-[32px] bg-gradient-to-br from-orange-50 to-white p-8 shadow-lg transition-shadow duration-300 hover:shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
            What Makes Us Different
          </p>

          <h2 className="mt-3 text-3xl font-black text-neutral-900">
            Điều làm MAY trở nên khác biệt
          </h2>

          <div className="mt-8 grid gap-5">
            {highlights.map((item, index) => (
              <div
                key={index}
                className="group rounded-[24px] border border-orange-100 bg-white/85 p-5 shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-400 transition-all duration-300 group-hover:bg-[#6c935b] group-hover:text-white">
                    {item.icon}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-neutral-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 leading-7 text-neutral-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100 text-orange-400">
            <FiFeather size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
              Core Values
            </p>
            <h2 className="font-serif text-3xl font-black text-neutral-900">
              Giá trị thương hiệu
            </h2>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {values.map((item, index) => (
            <div
              key={index}
              className="rounded-[30px] bg-white p-7 shadow-md transition-all duration-300 hover:-translate-y-[2px] hover:shadow-lg"
            >
              <div className="mb-4 h-[3px] w-12 rounded-full bg-[#6c935b]" />
              <h3 className="text-2xl font-black text-neutral-900">
                {item.title}
              </h3>
              <p className="mt-4 leading-8 text-neutral-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 overflow-hidden rounded-[36px] bg-gradient-to-r from-orange-400 to-orange-500 px-8 py-12 text-white shadow-xl md:px-12">
        <div className="flex flex-col items-center text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-100">
            Ready to explore
          </p>

          <h2 className="mt-3 font-serif text-3xl font-black md:text-4xl">
            Khám phá hương vị của MAY ngay hôm nay
          </h2>

          <p className="mt-4 max-w-2xl text-base leading-8 text-orange-50 md:text-lg">
            Thưởng thức những món best seller được yêu thích nhất và trải nghiệm
            phong cách đồ uống hiện đại, tinh tế và đầy cảm hứng.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-[#086136] shadow-md transition-all duration-300 hover:-translate-y-[2px] hover:bg-orange-50 hover:shadow-lg"
          >
            Xem sản phẩm
            <FiArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}

export default About;