import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../apiConfig";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  // NEW: Added "role" with a default value of "customer"
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "customer" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // If logging in, send just email/password. If registering, send everything (including role!)
        body: JSON.stringify(isLogin ? { email: formData.email, password: formData.password } : formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(isLogin ? "Logged in successfully!" : "Account created! Please log in.");
        
        if (isLogin) {
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("user", JSON.stringify(data.user));
          
          // Redirect based on role
          if (data.user.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/dashboard"); 
          }
        } else {
          setIsLogin(true); // Switch to login view after successful signup
        }
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error("Failed to connect to the server.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 w-full max-w-md">
        <h2 className="text-3xl font-serif font-bold text-center mb-6 text-gray-800">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                  placeholder="John Doe"
                />
              </div>

              {/* NEW: Role Selection Radio Buttons */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Account Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 hover:border-orange-500 transition-colors flex-1">
                    <input
                      type="radio"
                      name="role"
                      value="customer"
                      checked={formData.role === "customer"}
                      onChange={handleChange}
                      className="text-orange-600 focus:ring-orange-500 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-gray-700">Customer</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 hover:border-orange-500 transition-colors flex-1">
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={formData.role === "admin"}
                      onChange={handleChange}
                      className="text-orange-600 focus:ring-orange-500 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-gray-700">Admin</span>
                  </label>
                </div>
              </div>
            </>
          )}
          
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-orange-700 transition duration-300 shadow-md"
          >
            {isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-orange-600 font-semibold hover:underline"
            >
              {isLogin ? "Sign Up as Customer or Admin" : "Log In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;