import React from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div className="w-full min-h-screen bg-slate-950 text-white">
      <ToastContainer/>
      <Outlet />
    </div>
  );
};

export default App;
