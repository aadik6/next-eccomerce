"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa";
import { useAuthStore } from "@/stores/authStore";

export default function page() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();
  const { signup, loading, error: signupError } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Simulate registration process (replace with actual API call)
    try {
      const res = await signup(
        formData.email,
        formData.name,
        formData.password
      );

      router.push("/");
      formData.name = "";
      formData.email = "";
      formData.password = "";
      formData.confirmPassword = "";
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  const handleGoogleSignup = () => {
    // In a real app, implement OAuth with Google
    setTimeout(() => {
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: "Google User",
          email: "user@gmail.com",
        })
      );
      router.push("/"); // Redirect to home page
    }, 1000);
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card border-0 shadow-lg">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Create an Account</h2>
                <p className="text-muted">Join us to start shopping</p>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <div className="form-text">
                    Must be at least 6 characters.
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="termsCheck"
                    required
                  />
                  <label className="form-check-label" htmlFor="termsCheck">
                    I agree to the{" "}
                    <Link href="/terms" className="text-decoration-none">
                      Terms of Service
                    </Link>
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : null}
                  Create Account
                </button>
              </form>

              <div className="text-center my-4">
                <span className="bg-white px-2 text-muted">
                  or sign up with
                </span>
              </div>

              <button
                type="button"
                className="btn btn-outline-secondary btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={handleGoogleSignup}
                disabled={loading}
              >
                <FaGoogle color="#4285F4" />
                Sign up with Google
              </button>

              <div className="mt-4 text-center">
                <span className="text-muted">Already have an account? </span>
                <Link
                  href="/login"
                  className="text-decoration-none fw-semibold"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
