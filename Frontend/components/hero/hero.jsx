import React from 'react'

const Hero = () => {
  return (
    <div className="container hero-section ">
        <div className="row align-items-center min-vh-75">
          <div className="col-lg-6 col-md-12">
            <div className="hero-content mb-2 md:mb-0">
              <h1 className="display-4 fw-bold text-dark mb-3">
                Discover Amazing Products
              </h1>
              <p className="lead text-muted mb-4">
                Shop the latest trends with unbeatable prices. Quality products,
                fast delivery, and exceptional customer service.
              </p>
              <div className="hero-buttons">
                <button className="btn btn-primary btn-lg me-3">
                  Shop Now
                </button>
                <button className="btn btn-outline-secondary btn-lg">
                  Learn More
                </button>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-12 text-center">
            <div className="hero-image">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Shopping"
                className="img-fluid rounded shadow-lg"
                style={{ maxHeight: '500px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </div>
  )
}

export default Hero