import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export let socket = null;

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : import.meta.env.VITE_API_URL;

export const checkAuth = createAsyncThunk("auth/checkAuth", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/auth/check");
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const signup = createAsyncThunk("auth/signup", async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post("/auth/signup", data);
    toast.success("Account created successfully");
    return res.data;
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message);
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post("/auth/login", data);
    toast.success("Logged in successfully");
    return res.data;
  } catch (error) {
    toast.error(error.response.data.message);
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await axiosInstance.post("/auth/logout");
    toast.success("Logged out successfully");
  } catch (error) {
    toast.error(error.response.data.message);
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      toast.success("Profile updated successfully");
      return res.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);
const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,
    onlineUsers: [],
    isUpdatingProfile:false
  },
  reducers: {
    connectSocket: (state) => {
      if (!state.authUser || socket?.connected) return;

      console.log("connecting socket...");

      socket = io(BASE_URL, {
        query: { userId: state.authUser._id },
        withCredentials: true,
        transports:["websocket"]
      });

    },
      setOnlineUsers: (state, action) => {
  state.onlineUsers = action.payload;
},
    disconnectSocket: () => {
      if (socket?.connected)
        socket.disconnect();
      socket = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(checkAuth.pending, (state) => {
        state.isCheckingAuth = true;
      })

      .addCase(checkAuth.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isCheckingAuth = false;
      })

      .addCase(checkAuth.rejected, (state) => {
        state.authUser = null;
        state.isCheckingAuth = false;
      })

      .addCase(signup.pending, (state) => {
        state.isSigningUp = true;
      })

      .addCase(signup.fulfilled, (state, action) => {
        state.authUser = action.payload.user;
        state.isSigningUp = false;
      })

      .addCase(signup.rejected, (state) => {
        state.isSigningUp = false;
      })

      .addCase(login.pending, (state) => {
        state.isLoggingIn = true;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.authUser = action.payload.user;
        state.isLoggingIn = false;
        state.isCheckingAuth = false;
      })

      .addCase(login.rejected, (state) => {
        state.isLoggingIn = false;
      })

      .addCase(logout.fulfilled, (state) => {
        state.authUser = null;
        state.onlineUsers = [];
         if (socket?.connected) socket.disconnect();
      })
    
          // update profile
      .addCase(updateProfile.pending, (state) => {
        state.isUpdatingProfile = true;
      })

      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdatingProfile = false;
        state.authUser = action.payload;
      })

      .addCase(updateProfile.rejected, (state) => {
        state.isUpdatingProfile = false;
      });
  },
});

export const { connectSocket, disconnectSocket,setOnlineUsers } = authSlice.actions;

export default authSlice.reducer;