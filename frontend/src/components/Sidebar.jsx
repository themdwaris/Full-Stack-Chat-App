import React, { useEffect, useState } from "react";
import Avatar from "../components/Avatar";
import { IoLogOutOutline } from "react-icons/io5";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { BiSolidMessageSquareAdd } from "react-icons/bi";
import { FcGallery } from "react-icons/fc";
import { FcClapperboard } from "react-icons/fc";
import { ImUsers } from "react-icons/im";
import { logout } from "../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Overlay from "./Overlay";
import UpdateUserDeatils from "./UpdateUserDeatils";
import AllUsers from "./AllUsers";
import { Link } from "react-router-dom";
import { userChatContext } from "../context/chatContext";

const Sidebar = () => {
  const user = useSelector((state) => state?.user);
  // const socketConnection = useSelector(
  //   (state) => state?.user?.socketConnection
  // );
  const {socketConnection} = userChatContext()
  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);
  const [users, setUsers] = useState([]);
  const [active, setActive] = useState("chat");
  const [searchUser, setSearchUser] = useState(false);

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("sidebar", user?.userId);

      socketConnection.on("conversation", (data) => {
        // console.log(data);

        const getChatData = data?.map((chat, index) => {
          if (chat?.sender?._id === chat?.receiver?._id) {
            return {
              ...chat,
              userDetails: chat?.sender,
            };
          } else if (chat?.receiver?._id !== user?.userId) {
            return {
              ...chat,
              userDetails: chat?.receiver,
            };
          } else {
            return {
              ...chat,
              userDetails: chat?.sender,
            };
          }
        });
        setUsers(getChatData);
      });
    }
  }, [socketConnection, user]);

  return (
    <div className="w-full h-full flex">
      <div className="w-16 bg-slate-900 lg:bg-slate-800 h-screen py-6 flex flex-col justify-between px-1 border-r border-slate-700 sticky top-0 z-10">
        <div className="flex flex-col items-center gap-5">
          <p
            className={`${
              active === "chat" ? "text-green-500" : "text-slate-100"
            } cursor-pointer transition transform active:scale-90 `}
            title="Chat"
            onClick={() => setActive("chat")}
          >
            <IoChatbubbleEllipsesSharp size={26} />
          </p>
          <div>
            <p
              className={`${
                active === "users" ? "text-green-500" : "text-slate-100"
              } cursor-pointer transition transform active:scale-90 `}
              title="Add peoples"
              onClick={() => {
                setActive("users");
                setSearchUser(true);
              }}
            >
              <ImUsers size={26} />
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div
            onClick={(e) => {
              // e.stopPropagation()
              e.preventDefault();
              setEdit(true);
            }}
            className="w-full"
            title={user?.name}
          >
            <Avatar
              classname="w-9 h-9 mb-6"
              userId={user?.userId}
              avatar={user?.avatar}
              name={user?.name}
              textSize="text-[14px]"
              hide={true}
            />
            {edit && (
              <Overlay setEdit={setEdit}>
                <UpdateUserDeatils setEdit={setEdit} user={user} />
              </Overlay>
            )}
          </div>
          <p
            className="w-10 h-10 bg-red-700 rounded-full cursor-pointer flex items-center justify-center transition transform active:scale-90 hover:bg-red-600"
            title="Logout"
            onClick={() => {
              dispatch(logout());
              // navigate("/verifyEmail")
              localStorage.removeItem("chatUserToken");
            }}
          >
            <IoLogOutOutline size={23} />
          </p>
        </div>
      </div>
      <div className="w-full h-full overflow-x-hidden overflow-y-scroll custom-scrollbar">
        <h1 className="text-xl px-4 py-5 border-b border-slate-700 text-slate-100 mb-4">
          Messages
        </h1>

        {users?.length === 0 && (
          <div className="h-[70vh] flex justify-center items-center flex-col gap-5 py-5 relative">
            <p
              className="text-green-500 cursor-pointer transition transform active:scale-90 hover:text-green-600"
              onClick={() => setSearchUser(true)}
            >
              <BiSolidMessageSquareAdd size={35} />
            </p>

            <p className="text-balance text-slate-100">
              Add users to start conversations.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {users.length > 0 &&
            users?.map((user, index) => (
              <Link to={`/${user?.userDetails?._id}`} key={index}>
                <div className="w-full flex items-center justify-between cursor-pointer px-3 hover:bg-slate-800">
                  <div className="flex gap-3 items-center">
                    <Avatar
                      avatar={user?.userDetails?.avatar}
                      classname="w-10 h-10"
                      name={user?.userDetails?.name}
                      hide={true}
                    />
                    <div>
                      <p className="text-[16px] font-medium text-slate-50 text-ellipsis line-clamp-1">
                        {user?.userDetails?.name}
                      </p>
                      <div className="w-40 lg:max-w-44 text-[13px] font-light text-slate-200 flex items-center gap-1">
                        {user?.lastMsg?.videoUrl && (
                          <span>
                            <FcClapperboard size={18} />
                          </span>
                        )}
                        {user?.lastMsg?.imageUrl && (
                          <span>
                            <FcGallery size={18} />
                          </span>
                        )}
                        {user?.lastMsg?.text && (
                          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                            {user?.lastMsg?.text}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {user?.unreadMsg === 0 || user?.unreadMsg === 1 ? null : (
                    <p className="w-6 h-6 bg-green-500 rounded-full cursor-pointer text-xs flex items-center justify-center text-slate-950 flex-shrink-0">
                      {user?.unreadMsg}
                    </p>
                  )}
                </div>
              </Link>
            ))}
        </div>
      </div>

      {/* *********All user list popup************* */}
      {searchUser && (
        <div
          className="fixed inset-0 w-full h-screen flex justify-center items-center backdrop-blur-sm z-50 px-5"
          onClick={(e) => {
            e.stopPropagation();
            setSearchUser(false);
          }}
        >
          <AllUsers user={user} setSearchUser={setSearchUser} />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
