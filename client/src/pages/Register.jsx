import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  User,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { register } from "../store/slices/authSlice";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { isSigningUp } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData));
  };

  const dispatch = useDispatch();
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
                Create Account
              </h2>
              <p className="text-gray-600">
                Register to your account to continue
              </p>
            </div>
            {/* Register FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ">
                  FullName
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <User className="w-5 h-5" />
                  </span>
                  <input
                    className="w-full border border-gray-300 rounded-md py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    value={formData.fullName}
                    placeholder="Enter Your FullName"
                    onChange={(e) => {
                      setFormData({ ...formData, fullName: e.target.value });
                    }}
                    required
                  />
                </div>
              </div>
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
                disabled={isSigningUp}
                onSubmit={handleSubmit}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isSigningUp ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  "Register"
                )}
              </button>
            </form>

            {/* REGISTER LINK */}
            <p className="mt-6 text-center text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
