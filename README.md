# 🔗 DevConnect_Backend_Microservice

**DevConnect** is a professional networking platform for developers With Real-Time Chating, similar to LinkedIn but focused solely on dev-to-dev connection building. This repository contains the **backend microservice**, built using **Node.js**, **Express.js**, **MongoDB**, and **Socket.IO**, that powers user registration, authentication, connection requests, personalized feed system, and **real-time chat functionality**.

---

## ⚙️ Tech Stack

- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT Authentication** (Bearer token stored in localStorage)
- **Socket.IO** (for real-time communication)
- **Multer** + **Cloudinary** (for scalable image uploads)
- **Cookie-parser**, **dotenv**, **bcrypt**, etc.

---

## 🧑‍💻 Core Features

### 1. 📝 User Registration (Signup)
- Users can register using:
  - Email
  - Password
  - Profile photo (image)
- Image upload handled with **Multer** middleware.
- Profile images stored securely and scalably using **Cloudinary**.

### 2. 🔐 Login & JWT Auth
- After successful login, a **JWT token** is generated and sent directly to the client.
- Frontend stores the token in **localStorage** for persistent authentication.
- Every protected route verifies this token via the **Authorization Bearer header** in a custom **auth middleware**.
- Tokens expire after 7 days for enhanced security.

### 3. 👤 User Profile APIs
- **Get User Profile** – Fetches user details by ID or token.
- **Update User Profile** – Allows user to update their name, bio, and profile image.

### 4. 🤝 Developer Connection System
- **Send Connection Request** – Authenticated users can send requests to others.
- **Review Connection Request** – Accept or reject incoming connection requests.
- Connection logic handled via a dedicated **ConnectionRequest** model.

### 5. 📰 Developer Feed
- Authenticated users can access a **feed of all developer profiles** (excluding themselves and existing connections).
- Enables social discovery and community building.
- **Pagination support** – Feed loads 10 users at a time for optimal performance.

### 6. 💬 Real-Time Chat Feature ✨ *NEW*
- **Socket.IO integration** enables real-time messaging between connected developers.
- Built on top of existing Node.js + Express.js server using HTTP server wrapper.
- **Online/Offline Status** – Users can see which of their connections are currently online.
- **Instant Message Delivery** – Messages are delivered in real-time without page refresh.
- **Message Persistence** – All messages are stored in MongoDB using the Message model.
- **Image Sharing** – Users can send images in chat using Cloudinary integration.

#### Real-Time Events:
- `connection` – Triggered when a user connects to Socket.IO server
- `getOnlineUsers` – Broadcasts list of online users to all connected clients
- `newMessage` – Emits new messages to both sender and receiver in real-time
- `disconnect` – Triggered when a user disconnects, updates online users list

---

## 🗃️ Database Models

### 🔹 User Model
- Stores user credentials, profile info, and Cloudinary image URLs.
- Fields: `firstName`, `lastName`, `emailID`, `password`, `age`, `gender`, `photoURL`, `about`, `skills`

### 🔹 ConnectionRequest Model
- Tracks pending and accepted connection requests between users.
- Statuses: `interested`, `ignored`, `accepted`

### 🔹 Message Model ✨ *NEW*
- Stores all chat messages between users.
- Fields: `senderId`, `receiverId`, `text`, `image`, `createdAt`
- Supports text and image messages via Cloudinary.

---


## 📌 Highlights

- 🧱 **Modular Structure**: Clear separation of concerns (routes, controllers, models, middleware, socket utils).
- 🔐 **Secure Auth Flow**: Using **JWT Bearer tokens** with proper validation and token expiration.
- ☁️ **Scalable Media Handling**: Cloudinary enables seamless and scalable profile image and chat image storage.
- 🛡️ **Middleware-Based Access Control**: Protects all private routes and ensures only authenticated users access them.
- 🔄 **RESTful API Design**: Clean and consistent routes for all core functionalities.
- ⚡ **Real-Time Communication**: Socket.IO integration for instant messaging and online status updates.
- 📦 **Message Persistence**: All chat messages stored in MongoDB for history and retrieval.
- 🎯 **Optimized Performance**: Pagination in feed API prevents overloading client with large datasets.

---

## ✅ Skills Demonstrated

- Real-world backend engineering with **user auth**, **secure media handling**, **connection systems**, and **database modeling**.
- **Real-time application development** using Socket.IO for WebSocket connections.
- Scalable architecture for **microservice-based** full-stack applications.
- Hands-on experience with **JWT Bearer authentication**, **Multer-Cloudinary integration**, and **MongoDB querying**.
- **Event-driven architecture** for real-time features (online status, instant messaging).
- **Hybrid HTTP + WebSocket server** implementation for modern web applications.
- Preparedness to work in a **production-grade backend system**.

---

## 📂 Folder Structure

```
DevConnect_Backend_Microservice/
├── models/
│   ├── user.js
│   ├── connectionRequest.js
│   └── message.js          # ✨ NEW
├── routes/
│   ├── auth.js
│   ├── profile.js
│   ├── request.js
│   ├── user.js
│   └── message.js          # ✨ NEW
├── middlewares/
│   ├── auth.js
│   └── upload.js
├── utils/
│   ├── cloudinary.js
│   └── socket.js           # ✨ NEW
├── .env
├── app.js
└── server.js
```

---


## 🌐 API Endpoints Summary

### Authentication
- `POST /auth/signup` – Register new user
- `POST /auth/login` – Login and receive JWT token

### User Profile
- `GET /profile/view` – Get logged-in user profile
- `PATCH /profile/edit` – Update user profile

### Connections
- `POST /request/send/:status/:userId` – Send connection request
- `GET /user/requests/received` – Get received connection requests
- `GET /user/connections` – Get all accepted connections
- `DELETE /user/deleteconnection/:userId` – Remove connection

### Feed
- `GET /users/feed?page=1&limit=10` – Get paginated user feed

### Messages ✨ *NEW*
- `GET /message/connections` – Get all chat users
- `GET /message/:userToChatId` – Get messages with specific user
- `POST /message/:receiverId` – Send message (text/image)

---

## 🔮 Future Enhancements

- 📱 **Push Notifications** for new messages and connection requests
- 🔍 **Advanced Search** for developers by skills, location, and experience
- 👥 **Group Chat** functionality for developer communities
- 📊 **Analytics Dashboard** for user engagement metrics
- 🌍 **Internationalization** support for global developer community
- 🔔 **Read Receipts** and **Typing Indicators** for enhanced chat experience

---

## ✍️ Author

**Shourya Jain**

---

## 📄 License

This project is open source and available for educational purposes.