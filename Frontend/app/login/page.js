"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa";
import { useAuthStore } from "@/stores/authStore";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { loading, login, error: loginError,setUser,setToken } = useAuthStore();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (!email || !password) {
        throw new Error("Please fill in all fields");
      }
      const res = await login(email, password);

      if (loginError) {
        throw new Error(loginError);
      }
      if (res.status !== 200) {
        throw new Error(res.data.message || "Login failed");
      }
      router.push("/");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    }
  };

  const handleGoogleSignIn = async (credentialResponse) => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/googleLogin",
        {
          id_token: credentialResponse.credential,
        }
      );
      console.log(res, "while login with google");
      if (res.status !== 200) {
        throw new Error(res.data.message || "Google login failed");
      }
      setUser(res.data.user);
      setToken(res.data.accessToken);
      router.push("/");
    } catch (err) {
      console.error("Google login error:", err);
      setError(
        err.response?.data?.message || "Google login failed. Please try again."
      );
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card border-0 shadow-lg">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Welcome Back</h2>
                <p className="text-muted">Sign in to continue shopping</p>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    id="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-decoration-none small"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="rememberMe"
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Remember me
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
                  Sign In
                </button>
              </form>

              <div className="text-center my-4">
                <span className="bg-white px-2 text-muted">
                  or continue with
                </span>
              </div>

              {/* <button
                type="button"
                className="btn btn-outline-secondary btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <FaGoogle color="#4285F4" />
                Sign in with Google
              </button> */}
              <GoogleLogin
                onSuccess={handleGoogleSignIn}
                onError={(error) => setError(error.message)}
                logo="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                className="btn btn-outline-secondary btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
                text="Sign in with Google"
              />
              <div className="mt-4 text-center">
                <span className="text-muted">Don't have an account? </span>
                <Link
                  href="/signup"
                  className="text-decoration-none fw-semibold"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
