import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

const ChatContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [token, setToken] = useState("");
  const [user, setUser] = useState({});
  const [socketConnection, setSocketConnection] = useState(null);
  const backendUrl =
    import.meta.env.VITE_APP_BACKEND_URL;

  const value = {
    loading,
    setLoading,
    backendUrl,
    token,
    setToken,
    user,
    setUser,
    uploading,
    setUploading,
    socketConnection,
    setSocketConnection,
  };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

const userChatContext = () => useContext(ChatContext);

export { ChatContext, ChatContextProvider, userChatContext };
