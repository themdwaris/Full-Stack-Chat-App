import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userProfile from "../assets/userProfile.jpeg";
import { BiImageAdd } from "react-icons/bi";
import { MdOutlineImageNotSupported } from "react-icons/md";
import uploadFile from "../helpers/uploadFile";
import axios from "axios";
import { toast } from "react-toastify";
import { userChatContext } from "../context/chatContext";
import Loader from "../components/Loader";

const Register = () => {
  const { loading, setLoading, backendUrl,uploading,setUploading } = userChatContext();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    avatar: "",
  });

  const [avatar, setAvatar] = useState("");
  const navigate = useNavigate();

  const userImageHandler = async (e) => {
    e.stopPropagation();
    try {
      setUploading(true);
      const file = e.target.files[0];
      const userAvatar = await uploadFile(file);
      setAvatar(userAvatar?.url);
      setData((prev) => ({ ...prev, avatar: userAvatar?.url }));
      setUploading(false);
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };

  const removeAvatar =()=>{
    setData((prev)=>({...prev,avatar:""}))
    setAvatar("")
  }
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${backendUrl}/api/user/register`, data);
      if (res?.data?.success) {
        navigate("/verifyEmail");
        toast.success(res.data.message);
        setLoading(false);
        setData({
          name: "",
          email: "",
          password: "",
          avatar: "",
        });
      } else {
        toast.error(res?.data?.message);
        setLoading(false);
        
      }
    } catch (error) {
      setLoading(false);
      
      console.log("Failed to register:", error);
      toast.error(error.message || error);
    }
  };

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full min-h-[80vh] sm:min-h-screen flex items-center justify-center px-5">
      <div className="w-full flex flex-col gap-7 items-center py-8">
        <div className="flex items-center gap-2">
          <h1 className="text-center text-4xl sm:text-5xl font-medium select-none ">
            Sign Up
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
              src={avatar ? avatar : userProfile}
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover"
            />
            <input
              type="file"
              id="avatar"
              name="avatar"
              hidden
              onChange={userImageHandler}
            />
            {avatar ? (
              <div className="hidden absolute inset-0 bg-black/50 items-center justify-center group-hover:flex">
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeAvatar()
                  }}
                >
                  <MdOutlineImageNotSupported size={24} />
                </span>
              </div>
            ) : (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center leading-3 ">
                <span>
                  {uploading?(<Loader/>):(<BiImageAdd size={24} />)}
                </span>
              </div>
            )}
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={data.name}
            onChange={inputHandler}
            placeholder="Name"
            className="w-full p-3 outline-none rounded-lg border-b border-green-700 bg-white/10 text-[18px] font-light"
          />
          <input
            type="email"
            id="email"
            name="email"
            required
            value={data.email}
            onChange={inputHandler}
            placeholder="Email"
            className="w-full p-3 outline-none rounded-lg  border-b border-green-700 bg-white/10 text-[18px] font-light"
          />
          <input
            type="password"
            id="password"
            name="password"
            required
            value={data.password}
            onChange={inputHandler}
            placeholder="Password"
            className="w-full p-3 outline-none rounded-lg  border-b border-green-700 bg-white/10 text-[18px] font-light"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center gap-5 justify-center p-3 rounded-lg bg-green-700 text-xl cursor-pointer transition transform active:scale-90 ${
              loading && "opacity-50 cursor-not-allowed"
            }`}
          >
            <span>Sign Up</span> {loading && <Loader />}
          </button>
          <p className="text-sm ">
            Already have an account ?
            <Link to={"/verifyEmail"} className="underline cursor-pointer">
              &nbsp;Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
