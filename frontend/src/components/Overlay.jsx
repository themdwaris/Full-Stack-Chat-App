import React from "react";

const Overlay = ({ children, setEdit }) => {
  return (
    <div
      className="w-full fixed inset-0 min-h-[80vh] flex justify-center items-center backdrop-blur-sm px-5 z-50"
      onClick={(e) => {
        e.stopPropagation();
        setEdit(false);
        
      }}
    >
      {children}
    </div>
  );
};

export default React.memo(Overlay);
