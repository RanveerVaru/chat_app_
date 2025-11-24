import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Image, Send, X } from "lucide-react";
import { getSocket } from "../lib/socket";
import { sendMessage } from "../store/slices/chatSlice"; // when you create thunk
import { toast } from "react-toastify";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [mediaPreview, setMediaPreview] = useState(null); // image/video preview URL or base64
  const [media, setMedia] = useState(null);               // actual File object
  const [mediaType, setMediaType] = useState("");         // "image" | "video" | ""

  const fileInputRef = useRef(null);

  const { selectedUser } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  // -------------------- HANDLE FILE CHANGE --------------------
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMedia(file);
    const type = file.type; // e.g. "image/png" or "video/mp4"

    if (type.startsWith("image/")) {
      setMediaType("image");
      const reader = new FileReader();
      reader.onload = () => {
        setMediaPreview(reader.result); // base64 string for preview
      };
      reader.readAsDataURL(file);
    } else if (type.startsWith("video/")) {
      setMediaType("video");
      const videoUrl = URL.createObjectURL(file); // temp URL for video preview
      setMediaPreview(videoUrl);
    } else {
      // not image or video
      toast.error("Please select an image or video file.");
      setMedia(null);
      setMediaPreview(null);
      setMediaType("");
    }
  };

  // -------------------- REMOVE MEDIA --------------------
  const removeMedia = () => {
    setMedia(null);
    setMediaPreview(null);
    setMediaType("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // -------------------- SEND MESSAGE --------------------
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!text.trim() && !media) return; // nothing to send

    const data = new FormData();
    if (text.trim()) data.append("text", text.trim());
    if (media) data.append("media", media);
    if (selectedUser?._id) data.append("receiverId", selectedUser._id);

    // HERE you will dispatch your thunk when you write it
    dispatch(sendMessage(data));

    // Reset all
    setText("");
    setMedia(null);
    setMediaPreview(null);
    setMediaType("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // -------------------- OPTIONAL: SOCKET LISTENER --------------------
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !selectedUser?._id) return;

    const handleNewMessage = (newMessage) => {
      // Only push message if it belongs to current open chat
      if (
        newMessage.senderId === selectedUser._id ||
        newMessage.receiverId === selectedUser._id
      ) {
        dispatch({ type: "chat/pushNewMessage", payload: newMessage });
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [selectedUser?._id,]);

  // -------------------- JSX --------------------
  return (
    <div className="p-4 w-full">
      {/* Media preview box */}
      {mediaPreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            {mediaType === "image" ? (
              <img
                src={mediaPreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border border-gray-700"
              />
            ) : (
              <video
                src={mediaPreview}
                controls
                className="w-32 h-20 object-cover rounded-lg border border-gray-700"
              />
            )}

            <button
              onClick={removeMedia}
              type="button"
              className="absolute -top-2 right-2 w-5 h-5 bg-zinc-800 text-white rounded-full flex items-center justify-center hover:bg-black"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Input + Buttons */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*,video/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleMediaChange}
          />

          {/* Attach button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`hidden sm:flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:border-gray-100 transition ${
              mediaPreview ? "text-emerald-500" : "text-gray-400"
            }`}
          >
            <Image size={20} />
          </button>
        </div>

        {/* Send button */}
        <button
          type="submit"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
          disabled={!text.trim() && !media}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
