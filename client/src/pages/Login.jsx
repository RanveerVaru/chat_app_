import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { login } from "../store/slices/authSlice";

const Login = () => {
  const [showPassword, setShowPassword] = useState();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { isSigningIn } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };
  return (
    <>
      <div className="min-h-screen grid grid-cols-1 1g:grid-cols-2 bg-white ">
        {/* LEFT SIDE FORM */}
        <div className="flex flex-col justify-center items-center px-6 py-12 ">
          <div className="w-full max-w-md">
            {/* LOGO & HEADING */}
            <div className="flex flex-col items-center text-center mb-10">
              <MessageSquare className="w-12 h-12 text-blue-600 mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome Back!
              </h2>
              <p className="text-gray-600">Login to your account to continue</p>
            </div>
            {/* LOGIN FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    className="w-full border border-gray-300 rounded-md py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    value={formData.email}
                    placeholder="you@gmail.com"
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                    }}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input
                    className="w-full border border-gray-300 rounded-md py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    placeholder="********"
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className=" absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button*/}
              <button
                type="submit"
                disabled={isSigningIn}
                onSubmit={handleSubmit}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isSigningIn ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  "Login"
                )}
              </button>
            </form>

            {/* REGISTER LINK */}
            <p className="mt-6 text-center text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
