import { createSlice } from "@reduxjs/toolkit";
import { userChatContext } from "../context/chatContext";
// const {socketConnection} = userChatContext()

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userId: "",
    name: "",
    email: "",
    avatar: "",
    token: localStorage.getItem("chatUserToken")||"",
    onlineUser:[],
  },
  reducers: {
    setUser: (state, action) => {
      state.userId = action.payload._id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.avatar = action.payload.avatar;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state, action) => {
      state.userId = "";
      state.name = "";
      state.avatar = "";
      state.email = "";
      state.token = "";
      // socketConnection=null
    },
    setOnlineUser:(state,action)=>{
      state.onlineUser=action.payload
    },
    // setSocketConnection:(state,action)=>{
    //   state.socketConnection=action?.payload
    // }
  },
});

export const { setUser, setToken, logout,setOnlineUser, } = userSlice.actions;

export default userSlice.reducer;
