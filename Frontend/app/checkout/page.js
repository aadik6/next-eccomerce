"use client"
import useCartStore from '@/stores/cartStore'
import React, { useState } from 'react'

const CheckoutPage = () => {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart } = useCartStore();
  const [address, setAddress] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('khalti');

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = cartTotal > 1000 ? 0 : 50;
  const grandTotal = cartTotal + deliveryCharge;

  return (
    <div className="container py-5">
      <h2 className="mb-4 fw-bold">Checkout</h2>
      <div className="row g-4">
        {/* Cart Items */}
        <div className="col-lg-7">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white fw-semibold">Your Cart</div>
            <div className="card-body">
              {cart.length === 0 ? (
                <div className="text-center text-muted py-5">Your cart is empty.</div>
              ) : (
                <ul className="list-group list-group-flush">
                  {cart.map(item => (
                    <li key={item.id} className="list-group-item d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <img src={item.image} alt={item.title} style={{ width: 50, height: 50, objectFit: 'contain', marginRight: 16 }} />
                        <div>
                          <div className="fw-semibold">{item.title}</div>
                          <div className="text-muted small">Rs. {item.price} x {item.quantity}</div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => decreaseQuantity(item.id)}>-</button>
                        <span className="mx-2">{item.quantity}</span>
                        <button className="btn btn-outline-secondary btn-sm me-3" onClick={() => increaseQuantity(item.id)}>+</button>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => removeFromCart(item.id)}>Remove</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        {/* Address & Payment */}
        <div className="col-lg-5">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white fw-semibold">Delivery Address</div>
            <div className="card-body">
              <textarea
                className="form-control mb-3"
                rows={3}
                placeholder="Enter your delivery address"
                value={address}
                onChange={e => setAddress(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white fw-semibold">Payment Method</div>
            <div className="card-body">
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="radio"
                  name="payment"
                  id="khalti"
                  value="khalti"
                  checked={selectedPayment === 'khalti'}
                  onChange={() => setSelectedPayment('khalti')}
                />
                <label className="form-check-label" htmlFor="khalti">
                  <img src="https://seeklogo.com/images/K/khalti-logo-FA1B0E6DC7-seeklogo.com.png" alt="Khalti" style={{ width: 24, marginRight: 8 }} />
                  Khalti
                </label>
              </div>
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="radio"
                  name="payment"
                  id="esewa"
                  value="esewa"
                  checked={selectedPayment === 'esewa'}
                  onChange={() => setSelectedPayment('esewa')}
                />
                <label className="form-check-label" htmlFor="esewa">
                  <img src="https://seeklogo.com/images/E/esewa-logo-8A9F3C6E2B-seeklogo.com.png" alt="eSewa" style={{ width: 24, marginRight: 8 }} />
                  eSewa
                </label>
              </div>
            </div>
          </div>
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white fw-semibold">Order Summary</div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>Rs. {cartTotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Delivery Charge</span>
                <span>{deliveryCharge === 0 ? <span className="text-success">Free</span> : `Rs. ${deliveryCharge}`}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total</span>
                <span>Rs. {grandTotal.toFixed(2)}</span>
              </div>
              <button className="btn btn-success w-100 mt-4 fw-semibold" disabled={!address || cart.length === 0}>
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;