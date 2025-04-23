# 💬 Full-Stack Chat App

A real-time chat application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and Socket.IO. This application allows users to register, log in, and chat with each other in real time. It includes private chat, group chat, message notifications, and more.

## 🌟 Features

### 🔧 Backend Features

- **User Authentication**: Secure signup and login using JWT.
- **User Management**: Fetch all users for search and selection in chat.
- **Chat Management**:
  - One-to-one chat creation and retrieval.
- **Messages**:
  - Sending and retrieving messages.
  - Populating chat metadata with latest messages.
- **Real-Time Messaging**: Implemented using Socket.IO for live chat updates.

### 💻 Frontend Features

- **Authentication Screens**: Signup and login screens with form validation.
- **Home Page**: Shows the chat UI after login with:
  - My Chats (all personal chats).
  - Chat Box (open chat window).
  - Side Drawer (user search and profile access).
- **Responsive UI**: Mobile-friendly layout using React components.

## 📁 Folder Structure

```
Full-Stack-Chat-App/
├── backend/               # Express.js server
├── frontend/              # React app with Chakra UI
├── .env                   # Environment variables
└── README.md
```

## 🛠️ Technologies Used

- **Frontend**:
  - React.js
  - Axios
  - React Router DOM
  - Socket.IO-client

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - Socket.IO

- **Authentication**:
  - JSON Web Token (JWT)
  - bcryptjs

- **Others**:
  - dotenv for environment management
  - CORS and Express middlewares

## ⚙️ Getting Started

### Prerequisites

- Node.js and npm installed.
- MongoDB instance running (local or Atlas).

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/themdwaris/Full-Stack-Chat-App.git
cd Full-Stack-Chat-App
```

2. **Backend Setup**

```bash
cd backend
npm install
```

- Create a `.env` file in the backend directory and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

- Run the server:

```bash
npm run start
```

3. **Frontend Setup**

```bash
cd ../frontend
npm install
```

- Run the React development server:

```bash
npm start
```

### Accessing the Application

- Open `http://localhost:3000` in your browser.
- Register or login to start chatting.

## 🔐 API Endpoints

- **User Routes**
  - `POST /api/user/`: Register
  - `POST /api/user/login`: Login
  - `GET /api/user/`: Search users

- **Chat Routes**
  - `POST /api/chat/`: Access or create one-to-one chat
  - `GET /api/chat/`: Fetch all chats

- **Message Routes**
  - `POST /api/message/`: Send message
  - `GET /api/message/:chatId`: Get all messages of a chat

## 📬 Contact

For inquiries or contributions, feel free to reach out to [themdwaris](https://github.com/themdwaris).

