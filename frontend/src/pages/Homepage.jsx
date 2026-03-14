import React from "react";
import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
const Homepage = () => {
  const selectedUser = useSelector((state) => state.chat.selectedUser);
  return (
    <div className="min-h-screen bg-base-200">
      <div className="flex justify-center">
        <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-4rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
