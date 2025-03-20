import React, { useEffect, useRef, useState } from "react";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
// import { MdVideoLibrary } from "react-icons/md";
// import { MdPhotoLibrary } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { RiLink } from "react-icons/ri";
import { IoArrowBack } from "react-icons/io5";
import { MdOutlineFileDownload } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { FcGallery } from "react-icons/fc";
import { FcClapperboard } from "react-icons/fc";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Avatar from "./Avatar";
import uploadFile from "../helpers/uploadFile.js";
import { userChatContext } from "../context/ChatContext.jsx";
import ImageLoader from "./ImageLoader.jsx";
import moment from "moment";

const Messages = () => {
  const { userId } = useParams();
  // const socketConnection = useSelector(
  //   (state) => state?.user?.socketConnection
  // );
  const {socketConnection} = userChatContext()
  const { uploading, setUploading } = userChatContext();
  const user = useSelector((state) => state?.user);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    avatar: "",
    online: false,
  });
  const [media, setMedia] = useState(false);
  const [messages, setMessages] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });
  const [allMessages, setAllMessages] = useState([]);
  const msgRef = useRef();

  const handleUploadImage = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      const imageFile = await uploadFile(file);
      setMessages((prev) => ({ ...prev, imageUrl: imageFile?.url }));
      setUploading(false);
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };
  // console.log(messages);

  const handleUploadVideo = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      const videoFile = await uploadFile(file);
      setMessages((prev) => ({ ...prev, videoUrl: videoFile?.url }));
      setUploading(false);
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messages?.text || messages?.imageUrl || messages?.videoUrl) {
      if (socketConnection) {
        socketConnection.emit("new-message", {
          sender: user?.userId,
          receiver: userId,
          text: messages?.text,
          imageUrl: messages?.imageUrl,
          videoUrl: messages?.videoUrl,
          messageByUserId: user?.userId,
        });
      }
    }
    setMessages({
      text: "",
      imageUrl: "",
      videoUrl: "",
    });
  };

  const inputHandler = (e) => {
    const { value } = e.target;
    setMessages((prev) => ({ ...prev, text: value }));
  };

  useEffect(() => {
    if (msgRef?.current) {
      msgRef?.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [allMessages]);

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("message-page", userId);
      socketConnection.emit('seen',userId)
      socketConnection.on("message-user", (user) => {
        setUserData(user);
      });
      socketConnection.on("message", (data) => {
        setAllMessages(data);
        // console.log(data);
        
      });
    }
  
  }, [socketConnection, userId,user]);

  // console.log("render");

  return (
    <div className="w-full">
      {/* **********Header************ */}
      <header className="w-full h-[68px] sm:h-[69px] bg-slate-900 sticky top-0 border-b lg:border-l border-slate-700 flex items-center justify-between px-3 lg:px-5 z-10">
        <div className="flex items-center gap-3 lg:gap-4">
          <Link to="/" className="lg:hidden">
            <IoArrowBack size={24} />
          </Link>
          <Avatar
            avatar={userData?.avatar}
            name={userData?.name}
            userId={userData?._id}
            classname="w-10 h-10"
            hide={true}
          />
          <div>
            <p className="text-[14px] sm:text-sm">{userData?.name}</p>
            <p className="text-xs text-green-400">
              {userData?.online ? (
                "Online"
              ) : (
                <span className="text-slate-200">Offline</span>
              )}
            </p>
          </div>
        </div>
        <span className="px-2 cursor-pointer transition transform active:scale-90 hover:text-green-500">
          <IoEllipsisVerticalSharp size={18} />
        </span>
      </header>

      {/* *******User all messages, conversations  */}
      <div
        className="w-full h-[calc(100vh-185px)] lg:h-[calc(100vh-160px)] overflow-x-hidden overflow-y-auto relative"
        onClick={(e) => {
          e.stopPropagation();
          setMedia(false);
        }}
      >
        {/* *************Show all chats here********* */}
        <div className="flex flex-col gap-3 pt-5">
          {allMessages?.map((msg, index) => (
            <div
              ref={msgRef}
              key={index}
              className={`w-fit mb-2 px-5 max-w-[280px] md:max-w-sm lg:max-w-md ${
                user?.userId === msg?.messageByUserId ? "ml-auto " : ""
              }`}
            >
              {/* *********Display sending image***** */}
              {msg?.imageUrl && (
                <div
                  className={`w-fit max-w-sm rounded-lg p-1 mb-2 relative ${
                    user?.userId === msg?.messageByUserId
                      ? "bg-green-900 "
                      : "bg-blue-900 "
                  }`}
                >
                  <Link to={msg?.imageUrl} download>
                    {msg?.imageUrl && (
                      <img
                        src={msg?.imageUrl}
                        alt="photo"
                        className="w-full h-full object-scale-down rounded-lg"
                      />
                    )}
                    <span className="w-8 h-8 rounded-full absolute bottom-3 right-2 flex items-center justify-center p-1 cursor-pointer transition transform active:scale-90 bg-slate-900">
                      <MdOutlineFileDownload size={18} />
                    </span>
                  </Link>
                </div>
              )}

              {/* *********Display sending video***** */}
              {msg?.videoUrl && (
                <div
                  className={`w-fit max-w-sm rounded-lg p-1 mb-2 ${
                    user?.userId === msg?.messageByUserId
                      ? "bg-green-900 "
                      : "bg-blue-900 "
                  }`}
                >
                  {msg?.videoUrl && (
                    <video
                      controls
                      src={msg?.videoUrl}
                      alt="video"
                      className="w-full h-full object-scale-down rounded-lg"
                    />
                  )}
                </div>
              )}

              <div
                className={`px-2 py-1 text-sm sm:text-base text-white rounded-lg break-words ${
                  user?.userId === msg?.messageByUserId
                    ? "bg-green-900 "
                    : "bg-blue-900 "
                } `}
              >
                {msg?.text}
              </div>

              <p className="w-fit text-xs ml-auto mt-1">
                {moment(msg?.createdAt).format("hh:mm a")}
              </p>
            </div>
          ))}
        </div>

        {uploading && (
          <div className="h-full flex items-center justify-center p-5 sticky bottom-0">
            <ImageLoader />
          </div>
        )}

        {messages?.imageUrl && (
          <div
            ref={msgRef}
            className="w-full h-full flex items-center justify-center sticky bottom-0 backdrop-blur-sm z-20"
          >
            <div>
              <img
                src={messages?.imageUrl}
                alt="upload-image"
                className="aspect-square w-full h-full max-w-sm object-contain rounded-lg"
              />
            </div>
            <span
              className="cursor-pointer transition absolute right-5 top-5 transform active:scale-90 hover:text-gray-50"
              onClick={() => setMessages((prev) => ({ ...prev, imageUrl: "" }))}
            >
              <IoMdClose size={30} />
            </span>
          </div>
        )}

        {/* ********Display upload Video******** */}
        {messages?.videoUrl && (
          <div
            ref={msgRef}
            className="w-full h-full flex items-center justify-center sticky bottom-0 backdrop-blur-sm z-20"
          >
            <div>
              <video
                src={messages?.videoUrl}
                className="aspect-video w-full h-full max-w-sm"
                controls
                autoPlay
                muted
              />
            </div>
            <span
              className="cursor-pointer transition absolute right-0 top-0 transform active:scale-90 hover:text-gray-50"
              onClick={() => setMessages((prev) => ({ ...prev, videoUrl: "" }))}
            >
              <IoMdClose size={30} />
            </span>
          </div>
        )}
      </div>

      {/* ************Input bar / text bar*********** */}

      <form
        className="w-full h-[70px] flex items-center justify-center gap-3 sticky top-0 bottom-0"
        onSubmit={handleSendMessage}
      >
        <div className="relative w-[80%] flex items-center justify-center bg-white/10 rounded-full px-5">
          <input
            type="text"
            placeholder="Type message"
            name="message"
            value={messages?.text}
            onChange={inputHandler}
            className="w-full py-2 px-4 outline-none border-none bg-transparent"
          />
          <span
            className="text-slate-200 cursor-pointer transition transform active:scale-90 group"
            onClick={() => setMedia(!media)}
          >
            <RiLink size={23} />
          </span>
          <div
            className={`${
              media ? "w-40" : "w-0"
            } py-1 overflow-hidden transition-all rounded-xl bg-slate-800 text-slate-200 flex flex-col absolute bottom-14 right-0`}
          >
            <label
              className="flex py-2 px-4 items-center cursor-pointer gap-3 hover:bg-slate-700"
              id="photo"
              onClick={() => setMedia(false)}
            >
              <span>
                {/* <MdPhotoLibrary size={22} /> */}
                <FcGallery size={22} />
              </span>
              <span>Photo</span>
              <input
                type="file"
                id="photo"
                hidden
                onChange={handleUploadImage}
              />
            </label>
            <label
              className="flex py-2 px-4 items-center cursor-pointer gap-3 hover:bg-slate-700"
              id="video"
              onClick={() => setMedia(false)}
            >
              <span>
                <FcClapperboard size={22} />
              </span>
              <span>Video</span>
              <input
                type="file"
                id="video"
                hidden
                onChange={handleUploadVideo}
              />
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="w-8 h-8 sm:w-9 sm:h-9 pl-1 flex items-center justify-center bg-green-600 rounded-full cursor-pointer leading-3 transition transform active:scale-90"
        >
          <IoMdSend size={20} />
        </button>
      </form>
    </div>
  );
};

export default Messages;
