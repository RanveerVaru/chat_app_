import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getMessages } from "../store/slices/chatSlice";

import MessageSkeleton from "./skeletons/MessageSkeleton";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";

const ChatContainer = () => {
  const { messages, isMessagesLoading, selectedUser } = useSelector(
    (state) => state.chat
  );
  const { authUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  // 1) Fetch messages when selectedUser changes
  useEffect(() => {
    if (!selectedUser?._id) return;          // important guard
    dispatch(getMessages(selectedUser._id));
  }, [selectedUser?._id, ]);

  // 2) Auto-scroll to last message when messages change
  useEffect(() => {
    if (messagesEndRef.current && messages?.length) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // 3) Format timestamp
  function formatTimestamp(date) {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  // 4) Loading state
  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto bg-white">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  // 5) Main render
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      <ChatHeader />
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length > 0 &&
          messages.map((message, index) => {
            const isSender = message.senderId === authUser._id;

            return (
              <div
                key={message._id}
                className={`flex items-end ${
                  isSender ? "justify-end" : "justify-start"
                }`}
                // attach ref only to last message for auto-scroll
                ref={index === messages.length - 1 ? messagesEndRef : null}
              >
                {/* AVATAR */}
                <div
                  className={`w-10 h-10 rounded-full overflow-hidden border shrink-0 ${
                    isSender ? "order-2 ml-3" : "order-1 mr-3"
                  }`}
                >
                  <img
                    className="w-full h-full object-cover"
                    src={isSender ?  (selectedUser?.avatar?.url ||  "/avatar-holder.avif") : (authUser?.avatar?.url ||  "/avatar-holder.avif")}
                    alt="avatar"
                  />

                  
                </div>

                {/* BUBBLE */}
                <div
                  className={`max-w-xs sm:max-w-sm md:max-w-md px-4 py-2 rounded-xl text-sm ${
                    isSender
                      ? "bg-blue-400/20 text-black order-1"
                      : "bg-gray-200 text-black order-2"
                  }`}
                >
                  {/* Media */}
                  {message.media && (
                    <>
                      {message.media.includes(".webm") ||
                      message.media.includes(".mov") ||
                      message.media.includes(".mp4") ? (
                        <video
                          src={message.media}
                          className="w-full rounded-md mb-2"
                          controls
                        />
                      ) : (
                        <img
                          src={message.media}
                          alt="message-media"
                          className="w-full rounded-md mb-2"
                        />
                      )}
                    </>
                  )}

                  {/* Text */}
                  {message.text && <p>{message.text}</p>}

                  {/* Time */}
                  <span className="block text-[10px] mt-1 text-right text-gray-400">
                    {formatTimestamp(message.createdAt)}
                  </span>
                </div>
              </div>
            );
          })}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;

