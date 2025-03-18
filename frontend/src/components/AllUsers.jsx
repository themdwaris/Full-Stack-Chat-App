import React, { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { IoIosClose } from "react-icons/io";
import Avatar from "./Avatar";
import { userChatContext } from "../context/ChatContext.jsx";
import Loader from "./Loader";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AllUsers = ({ setSearchUser }) => {
  const { loading, setLoading, backendUrl } = userChatContext();
  const [input, setInput] = useState("");
  const [userList, setUserList] = useState([]);
  const [cachedUser, setCachedUser] = useState({});
  const navigate = useNavigate();

  const searchUser = async () => {
    // if (cachedUser[input]) {
    //   // console.log("Cached")
    //   setUserList(cachedUser[input]);
    //   return;
    // }
    try {
      setLoading(true);
      const res = await axios.post(`${backendUrl}/api/user/search`, {
        search: input,
      });
      if (res?.data?.success) {
        setUserList(res.data.users);
        // console.log("api");
        // setCachedUser((prev) => ({ ...prev, [input]: res?.data?.users }));
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("failed to get all user", error);
      toast.error(error.message || error);
    }
  };

  const filterUser = (userList) => {
    if (!userList || userList.length === 0) return;

    let copyUser = userList.slice();
    copyUser = copyUser.filter(
      (user) =>
        user.name.toLowerCase().includes(input) ||
        user.email.toLowerCase().includes(input) ||
        (input === "" && user)
    );
    setCachedUser(copyUser);
    // console.log("cached");
  };

  useEffect(() => {
    const time = setTimeout(() => {
      if (userList) {
        filterUser(userList);
      }
    }, 400);
    return () => clearTimeout(time);
  }, [input, userList]);

  useEffect(() => {
    searchUser();
  }, []);

  return (
    <div
      className="w-full relative max-w-[450px] mx-auto bg-gray-800 p-5 rounded-lg z-30"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="flex items-center justify-between mb-5 text-slate-100">
        <h1 className="font-medium">Add User</h1>
        <span
          className="cursor-pointer transition transform active:scale-95"
          onClick={() => setSearchUser(false)}
        >
          <IoIosClose size={30} />
        </span>
      </div>
      <div className="w-full flex flex-col justify-center items-center">
        <div className="w-full flex items-center px-3 py-1 rounded-lg bg-slate-700">
          <span className="text-slate-400">
            <BiSearch size={20} />
          </span>
          <input
            type="text"
            placeholder="Search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full outline-none bg-transparent border-none px-3 py-1 font-light "
          />
        </div>

        <div className="w-full flex flex-col gap-2 mt-5 max-h-[380px] overflow-y-auto custom-scrollbar">
          {/* No user found */}
          {cachedUser?.length === 0 && !loading && (
            <p className="text-center text-xl py-5 text-slate-100">
              No user found.
            </p>
          )}

          {loading && (
            <div className="flex justify-center">
              <Loader />
            </div>
          )}

          {cachedUser?.length > 0 &&
            cachedUser?.map((user, index) => (
              <div
                key={index}
                className="w-full flex items-center cursor-pointer px-3 hover:bg-slate-700"
                onClick={() => {
                  navigate(`/${user?._id}`);
                  setSearchUser(false);
                }}
              >
                <div className="flex gap-3 items-center">
                  <Avatar
                    userId={user?._id}
                    avatar={user?.avatar}
                    classname="w-12 h-12"
                    name={user?.name}
                    hide={true}
                  />
                  <div>
                    <p className="text-[16px] font-medium text-slate-50 text-ellipsis line-clamp-1">
                      {user?.name}
                    </p>
                    <p className="w-40 lg:max-w-44 text-[13px] font-light text-slate-200 text-ellipsis line-clamp-1">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
