import React, { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { LiaUserEditSolid } from "react-icons/lia";
import { MdOutlineImageNotSupported } from "react-icons/md";
import userProfile from "../assets/userProfile.jpeg";
import uploadFile from "../helpers/uploadFile";
import axios from "axios";
import { userChatContext } from "../context/ChatContext.jsx";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/userSlice";
import Loader from "./Loader";

const UpdateUserDeatils = ({ setEdit, user }) => {
  const { backendUrl, uploading, setUploading } = userChatContext();
  const userr = useSelector((state) => state?.user);
  const [data, setData] = useState({ name: user?.name, avatar: user?.avatar });
  const [avatar, setAvatar] = useState("");
  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await axios.post(`${backendUrl}/api/user/update`, data, {
        withCredentials: true,
      });
      if (res?.data?.success) {
        toast.success(res.data.message);
        dispatch(setUser(res?.data?.updatedUser));
        setEdit(false)
      }
    } catch (error) {
      console.log("failed to update user details:", error);
      toast.error(error.message || error);
    }
  };

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadAvatarHandler = async (e) => {
    e.stopPropagation();
    // e.preventDefault();
    try {
      setUploading(true);
      const file = e.target.files[0];
      const userAvatar = await uploadFile(file);
      setAvatar(userAvatar?.url);
      setData((prev) => ({ ...prev, avatar: userAvatar?.url }));
      setUploading(false);
    } catch (error) {
      console.log("Failed update user avatar:", error);
      setUploading(false);
    }
  };
  const removeAvatar = () => {
    setData((prev) => ({ ...prev, avatar: "" }));
    setAvatar("");
  };

  let shortName = "";
  if (userr?.name?.length > 0) {
    const alpha = userr?.name?.split(" ");
    if (alpha?.length > 1) {
      shortName = alpha[0][0] + alpha[1][0];
    } else {
      shortName = alpha[0][0];
    }
  }

  useEffect(()=>{setAvatar(userr?.avatar)},[])
  return (
    <div
      className="w-full bg-green-900 p-5 rounded-lg relative max-w-[400px] mx-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between gap-1">
        <h1 className="text-sm md:text-xl pb-4">Update Profile</h1>
        <span
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setEdit(false);
          }}
        >
          <IoIosClose size={30} />
        </span>
      </div>
      <form
        onSubmit={submitHandler}
        className="w-full flex flex-col gap-4 items-center"
      >
        <label htmlFor="avatar" className="w-full ">
          <input
            type="file"
            name="avatar"
            id="avatar"
            hidden
            onChange={uploadAvatarHandler}
          />
          <div className="w-20 h-20 overflow-hidden rounded-full mx-auto relative cursor-pointer group">
            {avatar ? (
              <img
                src={data?.avatar ? data?.avatar : userProfile}
                alt="avatar"
                className="absolute w-20 h-20 rounded-full object-cover group cursor-pointer"
              />
            ) : (
              <p
                className={`w-20 h-20 flex items-center justify-center rounded-full font-medium leading-3 text-white text-4xl bg-red-600`}
                title={"User Photo"}
              >
                {shortName}
              </p>
            )}
            {avatar ? (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeAvatar();
                  }}
                >
                  <MdOutlineImageNotSupported size={24} />
                </span>
              </div>
            ) : (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center leading-3 ">
                <span>
                  {uploading ? <Loader /> : <LiaUserEditSolid size={35} />}
                </span>
              </div>
            )}
            {/* <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
              {uploading?(<Loader/>):(<LiaUserEditSolid size={35} />)}
            </div> */}
          </div>
        </label>
        <label htmlFor="" className="w-full ">
          <input
            type="text"
            name="name"
            value={data?.name}
            onChange={inputHandler}
            autoFocus
            placeholder="Name"
            className="p-3 w-full bg-white/20 outline-none  font-light rounded-lg"
          />
        </label>
        <div className="w-full text-end mt-5">
          <button
            className="py-2 w-16 text-sm mr-4 bg-red-800 text-slate-100 rounded-lg cursor-pointer transition transform active:scale-90 hover:bg-red-500"
            onClick={() => setEdit(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="p-2 w-16 text-sm bg-slate-800 text-slate-100 rounded-lg cursor-pointer transition transform active:scale-90 hover:bg-slate-800"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default React.memo(UpdateUserDeatils);
