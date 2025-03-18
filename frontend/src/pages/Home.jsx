import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import io from "socket.io-client";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { logout, setOnlineUser, setUser } from "../store/userSlice";
import Sidebar from "../components/Sidebar";
import chat2 from "../assets/chat2.png";
import { userChatContext } from "../context/ChatContext.jsx";

const Home = () => {
  const { backendUrl, setSocketConnection } = userChatContext();
  const user = useSelector((state) => state?.user);
  const [path, setPath] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  // console.log(user);

  const getCurrentUser = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/user/userdetails`, {
        withCredentials: true,
      });

      if (res?.data?.user?.logout) {
        dispatch(logout());
        navigate("/verifyEmail");
        setSocketConnection(null);
      }
      if (res?.data?.success) {
        dispatch(setUser(res?.data?.user));
      }
      setLoading(false);
    } catch (error) {
      console.log("Failed to get user detail:", error);
      toast.error(error.message);
    }
  };
  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (!loading) {
      const localToken = localStorage.getItem("chatUserToken");
      if (!user?.token && !localToken) {
        navigate("verifyEmail");
      }
    }
  }, [user?.token, loading]);

  useEffect(() => {
    const socketConnection = io(import.meta.env.VITE_APP_BACKEND_URL, {
      auth: {
        token: localStorage.getItem("chatUserToken"),
      },
      withCredentials: true, // Make sure you add this line
      transports: ["websocket"], // Optional: Force WebSocket transport
    });
    socketConnection.on("onlineUser", (data) => {
      dispatch(setOnlineUser(data));
    });

    // dispatch(setSocketConnection(socketConnection));
    setSocketConnection(socketConnection);

    return () => socketConnection.disconnect();
  }, []);

  useEffect(() => {
    setPath(location?.pathname === "/");
  }, [location?.pathname]);

  return (
    <div className="w-full grid lg:grid-cols-[340px,1fr] min-h-screen">
      <div
        className={`bg-slate-950 lg:bg-slate-900 ${!path && "hidden"} lg:block`}
      >
        <Sidebar />
      </div>
      {/* Section */}
      <div className={`${path && "hidden"} lg:block`}>
        <Outlet />
        {path && (
          <div className="hidden lg:flex h-screen flex-col items-center justify-center ">
            <img src={chat2} alt="logo" className="w-[200px] object-cover" />
            <h1 className="text-[18px] md:text-2xl -mt-6 text-slate-100">
              Select people to chat
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
