import { useDispatch, useSelector } from "react-redux";
import { getMessages, addNewMessage } from "../store/chatSlice";
import { useEffect, useRef } from "react";
import { useState } from "react";
import ChatHeader from "../components/ChatHeader";
import MessageInput from "../components/MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { socket } from "../store/authSlice";
import { formatMessageTime } from "../lib/utils";
import { markMessagesSeen } from "../store/chatSlice";
const ChatContainer = () => {
  const dispatch = useDispatch();
  const [isTyping, setIsTyping] = useState(false);
  const { messages, isMessagesLoading, selectedUser } = useSelector(
    (state) => state.chat,
  );
  console.log("messages", messages);
  const { authUser } = useSelector((state) => state.auth);
  console.log(socket);
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser) {
      dispatch(getMessages(selectedUser._id));
    }
  }, [selectedUser, dispatch]);

  useEffect(() => {
    if (!socket || !selectedUser) return;

    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;

      dispatch(addNewMessage(newMessage));

      socket.emit("messageDelivered", {
        messageId: newMessage._id,
        senderId: newMessage.senderId,
      });
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket, selectedUser, dispatch]);

  // auto scroll to last message
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!socket || !selectedUser) return;

    const handleTyping = ({ senderId }) => {
      if (senderId !== selectedUser._id) return;

      setIsTyping(true);

      // পুরনো timer clear
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // নতুন timer start
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 5000);
    };

    socket.on("userTyping", handleTyping);

    return () => {
      socket.off("userTyping", handleTyping);
    };
  }, [socket, selectedUser]);

  useEffect(() => {
    if (selectedUser) {
      dispatch(markMessagesSeen(selectedUser._id));
    }
  }, [selectedUser]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile"
                />
              </div>
            </div>

            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>

            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}

              {message.text && <p>{message.text}</p>}

              {message.senderId === authUser._id && (
                <span className="text-xs">
                  {!message.delivered && "✓"}
                  {message.delivered && !message.seen && "✓✓"}
                  {message.seen && <span className="text-blue-500">✓✓</span>}
                </span>
              )}
            </div>
          </div>
        ))}

        <div ref={messageEndRef} />
      </div>

      {isTyping && (
        <div className="px-4 pb-2 flex items-center gap-1">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
        </div>
      )}
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
