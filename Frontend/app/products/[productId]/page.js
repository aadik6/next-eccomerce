"use client";
import React from 'react'

const page = ({params}) => {
  const [product, setProduct] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [quantity, setQuantity] = React.useState(1)
  
  const fetchProduct = async (productId) => {
    try {
      setLoading(true)
      const res = await fetch(`https://fakestoreapi.com/products/${productId}`);
      if (!res.ok) throw new Error('Product not found')
      const data = await res.json();
      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }
  
  React.useEffect(() => {
    if (params.productId) {
      fetchProduct(params.productId);
    }
  }, [params.productId]);

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger text-center">
          Product not found
        </div>
      </div>
    )
  }

  return (
    <div className="container my-5">
      <div className="row">
        {/* Product Image */}
        <div className="col-lg-6 col-md-12 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <img 
                src={product.image} 
                alt={product.title}
                className="img-fluid rounded"
                style={{
                  width: '100%',
                  height: '400px',
                  objectFit: 'contain'
                }}
              />
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="col-lg-6 col-md-12">
          <div className="product-details">
            {/* Category Badge */}
            <span className="badge bg-primary mb-3">
              {product.category}
            </span>
            
            {/* Product Title */}
            <h1 className="h2 fw-bold text-dark mb-3">
              {product.title}
            </h1>
            
            {/* Rating */}
            <div className="d-flex align-items-center mb-3">
              <div className="text-warning me-2">
                {'★'.repeat(Math.floor(product.rating.rate))}
                {'☆'.repeat(5 - Math.floor(product.rating.rate))}
              </div>
              <span className="text-muted">
                ({product.rating.count} reviews)
              </span>
            </div>
            
            {/* Price */}
            <div className="mb-4">
              <span className="h2 text-primary fw-bold">
                ${product.price}
              </span>
            </div>
            
            {/* Description */}
            <div className="mb-4">
              <h5 className="fw-semibold mb-2">Description</h5>
              <p className="text-muted">
                {product.description}
              </p>
            </div>
            
            {/* Quantity Selector */}
            <div className="row mb-4">
              <div className="col-md-4">
                <label className="form-label fw-semibold">Quantity</label>
                <div className="input-group">
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    className="form-control text-center"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                  />
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="d-flex gap-3 mb-4">
              <button className="btn btn-primary btn-lg flex-fill">
                <i className="bi bi-cart-plus me-2"></i>
                Add to Cart
              </button>
              <button className="btn btn-success btn-lg flex-fill">
                <i className="bi bi-lightning me-2"></i>
                Buy Now
              </button>
            </div>
            
            {/* Additional Info */}
            <div className="border-top pt-4">
              <div className="row text-center">
                <div className="col-4">
                  <div className="d-flex flex-column align-items-center">
                    <i className="bi bi-truck h4 text-primary mb-2"></i>
                    <small className="text-muted">Free Shipping</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="d-flex flex-column align-items-center">
                    <i className="bi bi-arrow-return-left h4 text-primary mb-2"></i>
                    <small className="text-muted">Easy Returns</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="d-flex flex-column align-items-center">
                    <i className="bi bi-shield-check h4 text-primary mb-2"></i>
                    <small className="text-muted">Secure Payment</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Products Section */}
      <div className="row mt-5">
        <div className="col-12">
          <h3 className="fw-bold mb-4">You might also like</h3>
          <div className="alert alert-info">
            Related products section can be added here
          </div>
        </div>
      </div>
    </div>
  )
}

export default page