type ProductCardProps = {
  name: string
  price: string
  image: string
}

function ProductCard({ name, price, image }: ProductCardProps) {
  return (
    <div className="product-card">
      <img src={image} alt={name} />
      <div className="product-info">
        <h3>{name}</h3>
        <p>{price}</p>
        <div className="product-actions">
          <button>Xem chi tiết</button>
          <button>Đặt ngay</button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard