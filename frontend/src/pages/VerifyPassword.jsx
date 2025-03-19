import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { userChatContext } from "../context/ChatContext.jsx";
import Loader from "../components/Loader";
import Avatar from "../components/Avatar";
import { useDispatch } from "react-redux";
import { setToken } from "../store/userSlice";

const VerifyPassword = () => {
  const { loading, setLoading, backendUrl,user } = userChatContext();
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();
  const dispatch = useDispatch()
 
//  console.log(user);
//  console.log(state);
 
 
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        `${backendUrl}/api/user/verifyPassword`,
        {
          password,
          userId: state?._id,
        },
        // { withCredentials: true }
        
      );
      if (res?.data?.success) {
        dispatch(setToken(res?.data?.token))
        localStorage.setItem("chatUserToken",res?.data?.token)
        navigate("/");
        setPassword("")
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
    if (!state?.name) {
      navigate("/verifyEmail");
    }
  },[]);

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
          <Avatar
            userId={state?._id}
            name={state?.name}
            avatar={state?.avatar}
            classname="w-20 h-20"
            textSize="text-3xl"
          />
          <input
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 outline-none rounded-lg  border-b border-green-700 bg-white/10 text-[18px] font-light"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center gap-5 justify-center p-3 rounded-lg bg-green-700 text-xl cursor-pointer transition transform active:scale-90 ${loading&&"opacity-50 cursor-not-allowed"}`}
          >
            <span>Login</span> {loading && <Loader />}
          </button>
          <p className="text-sm ">
            <Link to={"/forgot"} className="underline cursor-pointer">
              Forgot password ?
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default VerifyPassword;
