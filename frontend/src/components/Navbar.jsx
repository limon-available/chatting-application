import React from "react";
import { Link } from "react-router-dom";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { logout } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { disconnectSocket } from "../store/authSlice";
import { clearChat } from "../store/chatSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="w-full mx-auto px-4 h-16">
        <div className="flex justify-between h-full">
          <div className="flex items-center gap-8">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h2>Chatty</h2>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={"/settings"}
              className={`btn btn-sm gap-2 transition-colors`}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>
            <Link to={"/profile"} className={`btn btn-sm gap-2`}>
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </Link>
            <button
              className="flex items-center gap-2 btn btn-sm "
              onClick={() => {
                dispatch(logout());
                dispatch(disconnectSocket());
                dispatch(clearChat());
              }}
            >
              <LogOut className="size-5" />
              <span className="hidden sm:inline">LogOut</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
