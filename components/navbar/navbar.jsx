"use client";
import React from "react";
import Cart from "../cart/cart";

const Navbar = () => {
  const [categories, setCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = React.useState(false);

  // Mock user data - replace with actual user data from your auth system
  const mockUser = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://via.placeholder.com/40x40/007bff/ffffff?text=JD"
  };

  const fetchCategories = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("https://fakestoreapi.com/products/categories");
      if (!res.ok) {
        throw new Error(`Failed to fetch categories: ${res.status}`);
      }
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchCategories();
    // Check if user is logged in (replace with actual auth check)
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    if (loggedInStatus) {
      setIsLoggedIn(true);
      setUser(mockUser);
    }
  }, [fetchCategories]);

  const handleCategoryClick = (category, event) => {
    event.preventDefault();
    console.log(`Navigating to category: ${category}`);
    // Add your navigation logic here
  };

  const handleLogin = () => {
    // Mock login - replace with actual login logic
    setIsLoggedIn(true);
    setUser(mockUser);
    localStorage.setItem('isLoggedIn', 'true');
    console.log("User logged in");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setShowProfileDropdown(false);
    localStorage.removeItem('isLoggedIn');
    console.log("User logged out");
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleRetry = () => {
    fetchCategories();
  };

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

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger text-center" role="alert">
          <h4 className="alert-heading">Error Loading Categories</h4>
          <p>{error}</p>
          <button className="btn btn-outline-danger" onClick={handleRetry}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center py-3">
        {/* Navigation with Categories */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            {/* Brand */}
            <a className="navbar-brand fw-bold text-primary" href="#" onClick={(e) => e.preventDefault()}>
              ShopStore
            </a>

            {/* Mobile toggle button */}
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

            {/* Categories Navigation */}
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a 
                    className="nav-link fw-semibold" 
                    href="#"
                    onClick={(e) => e.preventDefault()}
                  >
                    Home
                  </a>
                </li>
                {categories.map((category, index) => (
                  <li className="nav-item" key={index}>
                    <a 
                      className="nav-link text-capitalize" 
                      href={`#${category}`}
                      onClick={(e) => handleCategoryClick(category, e)}
                    >
                      {category.replace(/['"]/g, '')}
                    </a>
                  </li>
                ))}
                <li className="nav-item">
                  <a 
                    className="nav-link" 
                    href="#"
                    onClick={(e) => e.preventDefault()}
                  >
                    About
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Right side: Cart and User */}
        <div className="d-flex align-items-center gap-3">
          {/* Cart */}
          <Cart />

          {/* User Authentication */}
          {!isLoggedIn ? (
            // Login Button
            <button 
              className="btn btn-outline-primary d-flex align-items-center gap-2"
              onClick={handleLogin}
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
              </svg>
              Login
            </button>
          ) : (
            // User Profile Dropdown
            <div className="dropdown">
              <button
                className="btn btn-light d-flex align-items-center gap-2 border"
                onClick={toggleProfileDropdown}
                aria-expanded={showProfileDropdown}
              >
                <img 
                  src={user.avatar} 
                  alt="" 
                  className="rounded-circle"
                  width="24" 
                  height="24"
                />
                <span className="d-none d-md-inline">{user.name}</span>
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                </svg>
              </button>
              
              {showProfileDropdown && (
                <div className="dropdown-menu dropdown-menu-end show position-absolute" style={{right: 0, top: '100%'}}>
                  <div className="dropdown-header">
                    <div className="fw-semibold">{user.name}</div>
                    <div className="text-muted small">{user.email}</div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <a 
                    className="dropdown-item" 
                    href="#"
                    onClick={(e) => e.preventDefault()}
                  >
                    <svg width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
                    </svg>
                    My Profile
                  </a>
                  <a 
                    className="dropdown-item" 
                    href="#"
                    onClick={(e) => e.preventDefault()}
                  >
                    <svg width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 15.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                    </svg>
                    My Orders
                  </a>
                  <a 
                    className="dropdown-item" 
                    href="#"
                    onClick={(e) => e.preventDefault()}
                  >
                    <svg width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                      <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
                    </svg>
                    Settings
                  </a>
                  <div className="dropdown-divider"></div>
                  <button 
                    className="dropdown-item text-danger" 
                    onClick={handleLogout}
                  >
                    <svg width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                      <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;