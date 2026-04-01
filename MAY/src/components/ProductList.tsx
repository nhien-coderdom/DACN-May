import ProductCard from './ProductCard'

function ProductList() {
  const products = [
    {
      id: 1,
      name: 'Trà sữa truyền thống',
      price: '45.000đ',
      image:
        'https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 2,
      name: 'Trà xanh sữa',
      price: '49.000đ',
      image:
        'https://images.unsplash.com/photo-1464306076886-da185f6a9d05?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 3,
      name: 'Hồng trà sữa',
      price: '47.000đ',
      image:
        'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 4,
      name: 'Trà đào',
      price: '42.000đ',
      image:
        'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1000&q=80',
    },
  ]

  return (
    <section className="product-section">
      <div className="section-title">
        <h2>Sản phẩm nổi bật</h2>
      </div>

      <div className="product-grid">
        {products.map((item) => (
          <ProductCard
            key={item.id}
            name={item.name}
            price={item.price}
            image={item.image}
          />
        ))}
      </div>
    </section>
  )
}

export default ProductList