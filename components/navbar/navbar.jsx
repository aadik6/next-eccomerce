"use client";
import React from "react";
import Cart from "../cart/cart";

const Navbar = () => {
  const [categories, setCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://fakestoreapi.com/products/categories");
      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await res.json();
      console.log(data, "categories data");
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    fetchCategories();
  }, []);
  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="container d-flex justify-content-between align-items-center my-3">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Navbar
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  Home
                </a>
              </li>
              {categories.map((category, index) => (
                <li className="nav-item" key={index}>
                  <a className="nav-link" href={`#${category}`}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </a>
                </li>
              ))}
              <li className="nav-item">
                <a className="nav-link" href="#">
                  About
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Cart />
    </div>
  );
};

export default Navbar;
