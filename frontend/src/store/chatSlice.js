import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";


// get users
export const getUsers = createAsyncThunk(
  "chat/getUsers",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/messages/users");
      return res.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);


// get messages
export const getMessages = createAsyncThunk(
  "chat/getMessages",
  async (userId, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      return res.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);


// send message
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (messageData, thunkAPI) => {
    const state = thunkAPI.getState();
    const selectedUser = state.chat.selectedUser;

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      return res.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const markMessagesSeen = createAsyncThunk(
  "chat/markMessagesSeen",
  async (userId) => {
    const res = await axiosInstance.put(`/messages/seen/${userId}`);
    return res.data;
  }
);
const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
  },

  reducers: {

    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },


    addNewMessage: (state, action) => {
      state.messages.push(action.payload);
    },

    updateDelivered: (state, action) => {
  const message = state.messages.find(
    (m) => m._id === action.payload
  );
  if (message) {
    message.delivered = true;
  }
},

updateSeen: (state, action) => {
  const message = state.messages.find(
    (m) => m._id === action.payload
  );
  if (message) {
    message.seen = true;
  }
},
    clearMessages: (state) => {
      state.messages = [];
    },
      clearChat: (state) => {
    state.messages = [];
    state.users = [];
    state.selectedUser = null;
  }
     
  },


  extraReducers: (builder) => {

    builder

      // users
      .addCase(getUsers.pending, (state) => {
        state.isUsersLoading = true;
      })

      .addCase(getUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.isUsersLoading = false;
      })

      .addCase(getUsers.rejected, (state) => {
        state.isUsersLoading = false;
      })


      // messages
      .addCase(getMessages.pending, (state) => {
        state.isMessagesLoading = true;
      })

      .addCase(getMessages.fulfilled, (state, action) => {
        state.messages = action.payload.messages;
        state.isMessagesLoading = false;
      })

      .addCase(getMessages.rejected, (state) => {
        state.isMessagesLoading = false;
      })


      // send message
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload.newMessage);
      });

  },
});

export const { setSelectedUser, addNewMessage, clearMessages,clearChat } = chatSlice.actions;

export default chatSlice.reducer;