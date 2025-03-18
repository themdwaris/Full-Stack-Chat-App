import React, { useEffect, useState } from "react";
import userProfile from "../assets/userProfile.jpeg";
import { useSelector } from "react-redux";

const Avatar = ({ userId, name, avatar, classname, textSize, hide }) => {
  const onlineUser = useSelector((state) => state?.user?.onlineUser);
  const [color, setColor] = useState(Math.floor(Math.random() * 8));

  let shortName = "";
  if (name?.length > 0) {
    const alpha = name?.split(" ");
    if (alpha?.length > 1) {
      shortName = alpha[0][0] + alpha[1][0];
    } else {
      shortName = alpha[0][0];
    }
  }

  const theme = [
    "bg-green-700",
    "bg-red-700",
    "bg-blue-700",
    "bg-slate-700",
    "bg-orange-700",
    "bg-lime-700",
    "bg-yellow-900",
    "bg-emerald-800",
  ];

  const isUserOnline = onlineUser?.includes(userId);

  useEffect(() => {
    setColor(Math.floor(Math.random() * 8));
  }, []);

  return (
    <div className="flex flex-col items-center gap-3 overflow-hidden">
      <label
        htmlFor="avatar"
        className={`inline-block ${classname} relative cursor-pointer my-3 bg-transparent  rounded-full`}
      >
        {avatar ? (
          <img
            src={avatar}
            alt="avatar"
            className={`${classname} rounded-full object-cover`}
          />
        ) : !name ? (
          <img
            src={userProfile}
            alt="avatar"
            className={`${classname} rounded-full object-cover `}
          />
        ) : (
          <p
            className={`${classname} flex items-center justify-center rounded-full font-medium leading-3 text-white ${textSize} ${theme[color]}`}
            title={name}
          >
            {shortName}
          </p>
        )}
        {isUserOnline && (
          <div className="h-[10px] w-[10px] rounded-full bg-green-600 p-1 absolute bottom-0 right-0">
            
          </div>
        )}
      </label>
      <p className={`text-xl -mt-3 mb-4 ${hide ? "hidden" : "block"}`}>
        {name}
      </p>
    </div>
  );
};

export default React.memo(Avatar);
