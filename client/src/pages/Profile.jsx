// src/pages/Profile.jsx
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Camera, Loader2, Mail, User, ArrowLeft } from "lucide-react";
import { updateProfile } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { authUser, isUpdatingProfile } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const fileInputRef = useRef(null);

  // When authUser changes, fill the form with current data
  useEffect(() => {
    if (authUser) {
      setFullName(authUser.fullName || "");
      setEmail(authUser.email || "");
      setAvatarPreview(authUser.avatar?.url || null);
    }
  }, [authUser]);

  // Handle avatar file select
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result); // base64 for preview
    };
    reader.readAsDataURL(file);
  };

  // Submit profile update
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim()) {
      toast.error("Full name and email are required");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", fullName.trim());
    formData.append("email", email.trim());
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    dispatch(updateProfile(formData));
  };

  if (!authUser) {
    // if user not loaded yet
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4">
      <div className="max-w-md mx-auto">
        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 text-sm mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to chats</span>
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Profile
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            View and update your account details.
          </p>

          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-300 bg-gray-100">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl">
                    <User className="w-10 h-10" />
                  </div>
                )}
              </div>

              {/* Camera button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center border-2 border-white shadow-sm hover:bg-blue-700"
              >
                <Camera className="w-4 h-4" />
              </button>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your full name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row sm:justify-end gap-3">
              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isUpdatingProfile && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
