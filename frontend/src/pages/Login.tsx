import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { Camera, Lock, Mail } from "lucide-react";

const Login = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const { login , isAuthenticated } : any = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/Dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e : any) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("res : " ,res)

      if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData);

        let errorMessage = "Something went wrong!";

        if (res.status === 404) {
          errorMessage = "User not found";
        } else if (res.status === 401) {
          errorMessage = "Wrong credentials";
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
        console.log(errorMessage);

        throw new Error(errorMessage);
      }

      const data = await res.json();

      login(data.token, data);

      toast.success("Login successful!");

      setTimeout(() => {
        navigate("/Dashboard", { replace: true });
      }, 2000);
    } catch (err) {
      console.error("There was a problem with the fetch operation:", err);
 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-600 to-blue-600 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-purple-300 animate-pulse"></div>
        <div className="absolute top-3/4 left-1/2 w-24 h-24 rounded-full bg-blue-300 animate-ping"></div>
        <div className="absolute top-1/2 left-3/4 w-40 h-40 rounded-full bg-pink-300 animate-pulse"></div>
      </div>
      
      {/* Floating images in background */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute -top-10 -left-10 w-64 h-64 rotate-12 transform transition-all duration-1000 hover:scale-110">
          <div className="w-full h-full bg-white rounded-lg shadow-lg"></div>
        </div>
        <div className="absolute top-1/4 -right-12 w-48 h-48 -rotate-6 transform transition-all duration-1000 hover:scale-110">
          <div className="w-full h-full bg-white rounded-lg shadow-lg"></div>
        </div>
        <div className="absolute bottom-1/4 left-1/4 w-56 h-56 rotate-45 transform transition-all duration-1000 hover:scale-110">
          <div className="w-full h-full bg-white rounded-lg shadow-lg"></div>
        </div>
      </div>

      <div className="w-full max-w-md transform transition-all duration-500 hover:scale-105">
        <div className="bg-white bg-opacity-95 backdrop-blur-md rounded-2xl shadow-2xl p-8 transition-all duration-500">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-full">
              <Camera size={32} className="text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">
            Welcome Back
          </h1>
          <p className="text-center text-gray-600 mb-6">Sign in to access your stock images</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <Mail size={18} />
              </div>
              <input
                className="pl-10 pr-4 py-3 w-full bg-gray-50 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 focus:outline-none"
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && !password && !email && (
                <p className="text-red-500 text-sm mt-1 animate-pulse">{error}</p>
              )}
            </div>
            
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <Lock size={18} />
              </div>
              <input
                className="pl-10 pr-10 py-3 w-full bg-gray-50 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 focus:outline-none"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
              {error && !email && password && (
                <p className="text-red-500 text-sm mt-1 animate-pulse">{error}</p>
              )}
            </div>
            
            
            <button
              className={`w-full  bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1 focus:outline-none ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
          
        
          
          <div className="mt-6 text-center">
            <span className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-purple-600 hover:text-purple-800 font-semibold transition duration-300"
              >
                Sign Up
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;