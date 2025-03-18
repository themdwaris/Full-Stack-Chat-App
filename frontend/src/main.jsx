import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes/index.jsx";
import { Provider } from "react-redux";
import "./index.css";
import store from "./store/store.js";
import { ChatContextProvider } from "./context/chatContext.jsx";

createRoot(document.getElementById("root")).render(
  <ChatContextProvider>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </ChatContextProvider>
);
