import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes/index.jsx";
import { ChatContextProvider } from "./context/chatContext.jsx";
import { Provider } from "react-redux";
import "./index.css";
import store from "./store/store.js";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ChatContextProvider>
      <RouterProvider router={router} />
    </ChatContextProvider>
  </Provider>
);
