import React from "react";
import { ShoppingCart, Plus, Minus, X, ShoppingBag } from "lucide-react";
import useCartStore from "@/stores/cartStore";
import Link from "next/link";

const Cart = () => {
  const {
    cart,
    getCartCount,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCartStore();

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
 const handleProceedToCheckout = () => {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    const offcanvasEl = document.getElementById("cartOffcanvas");
    if (offcanvasEl) {
      const bsOffcanvas =
        bootstrap.Offcanvas.getInstance(offcanvasEl) ||
        new bootstrap.Offcanvas(offcanvasEl);
      bsOffcanvas.hide();
    }

    // Fallback
    const closeButton = document.querySelector("#cartOffcanvas .btn-close");
    if (closeButton) closeButton.click();
  }
};

  return (
    <div className="position-relative">
      {/* Cart Button */}
      <button
        className="btn position-relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          border: "none",
          borderRadius: "50px",
          padding: "10px 20px",
          color: "white",
          fontWeight: "600",
          fontSize: "16px",
          boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
          transition: "all 0.3s ease",
        }}
        data-bs-toggle="offcanvas"
        href="#cartOffcanvas"
      >
        <ShoppingCart className="me-2" size={20} />
        Cart
        {getCartCount() > 0 && (
          <span
            className="translate-middle badge rounded-pill"
            style={{
              fontSize: "12px",
              padding: "4px 8px",
              top: "1px",
              right: "-10px",
            }}
          >
            {getCartCount()}
          </span>
        )}
      </button>

      {/* Offcanvas Cart */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="cartOffcanvas"
        style={{
          width: "420px",
          background: "linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)",
        }}
      >
        {/* Header */}
        <div
          className="offcanvas-header border-0 pb-0"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            padding: "24px",
          }}
        >
          <div className="d-flex align-items-center">
            <ShoppingBag className="me-3" size={24} />
            <div>
              <h5 className="offcanvas-title mb-0 fw-bold">Shopping Cart</h5>
              <small className="opacity-75">{getCartCount()} items</small>
            </div>
          </div>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
            style={{
              borderRadius: "50%",
              padding: "12px",
            }}
          ></button>
        </div>

        {/* Body */}
        <div className="offcanvas-body p-0">
          {cart.length === 0 ? (
            <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center p-4">
              <div
                className="mb-4 d-flex align-items-center justify-content-center"
                style={{
                  width: "100px",
                  height: "100px",
                  background:
                    "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)",
                  borderRadius: "50%",
                }}
              >
                <ShoppingCart size={40} className="text-muted" />
              </div>
              <h6 className="text-muted mb-2">Your cart is empty</h6>
              <p className="text-muted small">Add some items to get started!</p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div
                className="px-3 py-2"
                style={{ maxHeight: "400px", overflowY: "auto" }}
              >
                {cart.map((item, index) => (
                  <div
                    key={item.id}
                    className="card border-0 mb-3 shadow-sm"
                    style={{
                      borderRadius: "16px",
                      background: "white",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      animation: `slideIn 0.3s ease ${index * 0.1}s both`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 25px rgba(0,0,0,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 2px 10px rgba(0,0,0,0.08)";
                    }}
                  >
                    <div className="card-body p-3">
                      <div className="d-flex align-items-center">
                        <div
                          className="me-3"
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "12px",
                            overflow: "hidden",
                            background: "#f8f9fa",
                          }}
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>

                        <div className="flex-grow-1 me-3">
                          <h6
                            className="mb-1 fw-semibold"
                            style={{ fontSize: "14px" }}
                          >
                            {item.title}
                          </h6>
                          <div className="d-flex align-items-center mt-2">
                            <button
                              className="btn btn-sm d-flex align-items-center justify-content-center"
                              onClick={() => decreaseQuantity(item.id)}
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "8px",
                                border: "1px solid #e9ecef",
                                background: "white",
                                color: "#6c757d",
                                transition: "all 0.2s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = "#f8f9fa";
                                e.target.style.borderColor = "#667eea";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = "white";
                                e.target.style.borderColor = "#e9ecef";
                              }}
                            >
                              <Minus size={12} />
                            </button>

                            <span
                              className="mx-3 fw-semibold"
                              style={{
                                minWidth: "20px",
                                textAlign: "center",
                                fontSize: "14px",
                              }}
                            >
                              {item.quantity}
                            </span>

                            <button
                              className="btn btn-sm d-flex align-items-center justify-content-center"
                              onClick={() => increaseQuantity(item.id)}
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "8px",
                                border: "1px solid #e9ecef",
                                background: "white",
                                color: "#6c757d",
                                transition: "all 0.2s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = "#f8f9fa";
                                e.target.style.borderColor = "#667eea";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = "white";
                                e.target.style.borderColor = "#e9ecef";
                              }}
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>

                        <div className="text-end">
                          <div
                            className="fw-bold mb-2"
                            style={{
                              background:
                                "linear-gradient(135deg, #667eea, #764ba2)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              fontSize: "16px",
                            }}
                          >
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          <button
                            className="btn btn-sm p-1"
                            onClick={() =>
                              removeFromCart && removeFromCart(item.id)
                            }
                            style={{
                              color: "#dc3545",
                              background: "rgba(220, 53, 69, 0.1)",
                              border: "none",
                              borderRadius: "6px",
                              transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background =
                                "rgba(220, 53, 69, 0.2)";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background =
                                "rgba(220, 53, 69, 0.1)";
                            }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div
                className="p-4 border-top"
                style={{
                  background: "white",
                  borderTop: "1px solid #e9ecef !important",
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fw-semibold text-muted">Total:</span>
                  <span
                    className="h5 mb-0 fw-bold"
                    style={{
                      background: "linear-gradient(135deg, #667eea, #764ba2)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>

                <Link
                  className="btn w-100 fw-semibold"
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                    borderRadius: "12px",
                    padding: "14px",
                    color: "white",
                    fontSize: "16px",
                    boxShadow: "0 4px 20px rgba(102, 126, 234, 0.3)",
                    transition: "all 0.3s ease",
                  }}
                  href="/checkout"
                  onClick={handleProceedToCheckout} // Attach the function here
                >
                  Proceed to Checkout
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .offcanvas-body::-webkit-scrollbar {
          width: 6px;
        }

        .offcanvas-body::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .offcanvas-body::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 10px;
        }

        .offcanvas-body::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #5a67d8, #6b46c1);
        }
      `}</style>
    </div>
  );
};

export default Cart;
