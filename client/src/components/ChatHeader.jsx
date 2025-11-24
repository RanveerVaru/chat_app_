import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../store/slices/chatSlice"; // adjust path if needed

const ChatHeader = () => {
  const { selectedUser } = useSelector((state) => state.chat);
  const { onlineUsers } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  if (!selectedUser) return null; // safety: no header if no user selected

  const isOnline = onlineUsers?.includes(selectedUser._id);

  return (
    <div className="p-3 border-b bg-gray-200 ring-1 ring-gray-300">
      <div className="flex items-center justify-between">
        {/* USER INFO */}
        <div className="flex items-center gap-3">
          {/* AVATAR */}
          <div className="relative w-10 h-10">
            <img
              src={selectedUser?.avatar?.url || "/avatar-holder.avif"}
              alt="avatar-holder.avif"
              className="w-full h-full object-cover rounded-full"
            />

            {/* Online dot */}
            {isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-white border-2 rounded-full" />
            )}
          </div>

          {/* Name and Status */}
          <div>
            <h3 className="font-medium text-base text-black">
              {selectedUser?.fullName}
            </h3>
            <p className="text-sm text-black">
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close Button (clear selected chat) */}
        <button
          onClick={() => dispatch(setSelectedUser(null))}
          className="text-gray-800 hover:text-black transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
