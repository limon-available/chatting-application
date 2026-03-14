import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import SettingsPage from "./pages/SettingsPage";
import Homepage from "./pages/Homepage";
import ProfilePage from "./pages/ProfilePage";
import { useSelector, useDispatch } from "react-redux";
import { socket } from "./store/authSlice";
import { connectSocket, setOnlineUsers } from "./store/authSlice";

import { checkAuth } from "./store/authSlice";
import { Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";
function App() {
  const user = useSelector((state) => state.auth.authUser);
  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkAuth());
  }, []);
  useEffect(() => {
    if (user) {
      dispatch(connectSocket());
      socket.on("getOnlineUsers", (userIds) => {
        console.log("online users:", userIds);
        dispatch(setOnlineUsers(userIds));
      });
    }
  }, [user]);

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Homepage /> : <LoginPage />} />
        <Route
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!user ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route path="/settings" element={<SettingsPage />} />

        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  );
}

export default App;
