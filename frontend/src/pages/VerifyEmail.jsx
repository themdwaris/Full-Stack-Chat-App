import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userProfile from "../assets/userProfile.jpeg";
import axios from "axios";
import { toast } from "react-toastify";
import { userChatContext } from "../context/ChatContext.jsx";

import Loader from "../components/Loader";
import { useSelector } from "react-redux";

const VerifyEmail = () => {
  const { loading, setLoading, backendUrl, setUser } = userChatContext();
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { token } = useSelector((state) => state?.user);
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        `${backendUrl}/api/user/verifyEmail`,
        {
          email,
        },
        
      );
      if (res?.data?.success) {
        setUser(res?.data?.user);
        // console.log(res.data);
        navigate("/verifyPassword", { state: res.data.user });
        setEmail("");
        toast.success(res.data.message);
        setLoading(false);
      } else {
        toast.error(res?.data?.message);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log("Failed to login:", error);
      toast.error(error.message || error);
    }
  };

  useEffect(() => {
    const localToken = localStorage.getItem("chatUserToken");
    if (token && localToken) {
      navigate("/");
    }
  }, [token]);

  return (
    <div className="w-full h-[80vh] md:h-screen flex items-center justify-center px-5">
      <div className="w-full flex flex-col gap-7 items-center py-8">
        <div className="flex items-center gap-2">
          <h1 className="text-center text-4xl sm:text-5xl font-medium select-none ">
            Sign In
          </h1>
          <span className="h-[2px] w-11 bg-green-700"></span>
        </div>
        <form
          onSubmit={submitHandler}
          className="w-full max-w-[400px] mx-auto flex flex-col items-center justify-center gap-4"
        >
          <label
            htmlFor="avatar"
            className="inline-block w-20 h-20 relative cursor-pointer my-3 bg-transparent overflow-hidden rounded-full group"
          >
            <img
              src={userProfile}
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover"
            />
          </label>

          <input
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 outline-none rounded-lg  border-b border-green-700 bg-white/10 text-[18px] font-light"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center gap-5 justify-center p-3 rounded-lg bg-green-700 text-xl cursor-pointer transition transform active:scale-90 ${
              loading && "opacity-50 cursor-not-allowed"
            }`}
          >
            <span>Next</span> {loading && <Loader />}
          </button>
          <p className="text-sm ">
            Don't have an account ?
            <Link to={"/register"} className="underline cursor-pointer">
              &nbsp;Signup
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
