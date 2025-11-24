import { LogOut, MessageSquare, User } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../store/slices/authSlice";

const Navbar = () => {
  const { authUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogOut = () => {
    dispatch(logout());
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* LEFT: LOGO */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <h1 className="text-lg font-bold text-gray-800 ">
                Chat App
              </h1>
            </Link>
          </div>

          {/* RIGHT: USER INFO + LOGOUT */}
          {authUser && (
            <div className="flex items-center gap-3">
              {/* Profile link with full name */}
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">
                  {authUser.fullName || "Profile"}
                </span>
              </Link>

              {/* Logout button */}
              <button
                onClick={handleLogOut}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-red-700 hover:bg-red-100 transition"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
