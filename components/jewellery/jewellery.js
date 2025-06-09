"use client"

import React from 'react'

const Jewellery = () => {
    const [jewellery, setJewellery] = React.useState([])
    const [loading, setLoading] = React.useState(true)

    const fetchJewellery = async () => {
        try {
            setLoading(true)
            const res = await fetch("https://fakestoreapi.com/products/category/jewelery")
            if (!res.ok) {
                throw new Error('Failed to fetch jewellery')
            }
            const data = await res.json()
            console.log(data,"jewellery data")
            setJewellery(data)
        } catch (error) {
            console.error('Error fetching jewellery:', error)
        } finally {
            setLoading(false)
        }
    }
    
    React.useEffect(() => {
        fetchJewellery()
    }, [])

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

    return (
        <div className="container my-5">
            <div className="text-center mb-5">
                <h2 className="display-5 fw-bold text-dark">Featured Jewellery</h2>
                <p className="lead text-muted">Discover our premium collection</p>
            </div>
            
            <div className="row g-4">
                {jewellery.map((item) => (
                    <div key={item.id} className="col-lg-3 col-md-6 col-sm-12">
                        <div className="card h-100 shadow-sm border-0">
                            <div className="card-img-top-container" style={{height: '250px', overflow: 'hidden'}}>
                                <img 
                                    src={item.image} 
                                    className="card-img-top" 
                                    alt={item.title}
                                    style={{
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: 'contain',
                                        padding: '15px'
                                    }}
                                />
                            </div>
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title text-truncate" title={item.title}>
                                    {item.title}
                                </h5>
                                <p className="card-text text-muted small flex-grow-1">
                                    {item.description.substring(0, 100)}...
                                </p>
                                <div className="d-flex justify-content-between align-items-center mt-auto">
                                    <span className="h5 text-primary mb-0">
                                        ${item.price}
                                    </span>
                                    <div className="text-warning">
                                        {'★'.repeat(Math.floor(item.rating.rate))}
                                        <small className="text-muted ms-1">
                                            ({item.rating.count})
                                        </small>
                                    </div>
                                </div>
                                <button className="btn btn-primary mt-3">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Jewellery