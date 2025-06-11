"use client"

import Link from 'next/link'
import React from 'react'

const Electronics = () => {
    const [electronics, setElectronics] = React.useState([])
    const [loading, setLoading] = React.useState(true)

    const fetchElectronics = async () => {
        try {
            setLoading(true)
            const res = await fetch("https://fakestoreapi.com/products/category/electronics")
            if (!res.ok) {
                throw new Error('Failed to fetch electronics')
            }
            const data = await res.json()
            console.log(data,"electronics data")
            setElectronics(data)
        } catch (error) {
            console.error('Error fetching electronics:', error)
        } finally {
            setLoading(false)
        }
    }
    
    React.useEffect(() => {
        fetchElectronics()
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
                <h2 className="display-5 fw-bold text-dark">Featured Electronics</h2>
                <p className="lead text-muted">Discover our premium collection</p>
            </div>
            
            <div className="row g-4">
                {electronics.map((item) => (
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
                                <Link href={`/products/${item.id}`} className="btn btn-primary mt-3">
                                    Add to Cart
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Electronics