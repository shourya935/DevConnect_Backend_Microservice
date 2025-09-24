# 🔗 DevConnect_Backend_Microservice

**DevConnect** is a professional networking platform for developers, similar to LinkedIn but focused solely on dev-to-dev connection building. This repository contains the **backend microservice**, built using **Node.js**, **Express.js**, and **MongoDB**, that powers user registration, authentication, connection requests, and a personalized feed system.

---

## ⚙️ Tech Stack

- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT Authentication** (stored in HTTP-only cookies)
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
- After successful login, a **JWT token** is generated and sent as an **HTTP-only cookie** to the client.
- Every protected route verifies this token via a custom **auth middleware**.

### 3. 👤 User Profile APIs
- **Get User Profile** – Fetches user details by ID or token.
- **Update User Profile** – Allows user to update their name, bio, and profile image.

### 4. 🤝 Developer Connection System
- **Send Connection Request** – Authenticated users can send requests to others.
- **Review Connection Request** – Accept or reject incoming connection requests.
- Connection logic handled via a dedicated **ConnectionRequest** model.

### 5. 📰 Developer Feed
- Authenticated users can access a **feed of all developer profiles** (excluding themselves).
- Enables social discovery and community building.

---

## 🗃️ Database Models

### 🔹 User Model
- Stores user credentials, profile info, and Cloudinary image URLs.

### 🔹 ConnectionRequest Model
- Tracks pending and accepted connection requests between users.

---

## 📌 Highlights

- 🧱 **Modular Structure**: Clear separation of concerns (routes, controllers, models, middleware).
- 🔐 **Secure Auth Flow**: Using **JWT** + **cookies** with proper validation and token expiration.
- ☁️ **Scalable Media Handling**: Cloudinary enables seamless and scalable profile image storage.
- 🛡️ **Middleware-Based Access Control**: Protects all private routes and ensures only authenticated users access them.
- 🔄 **RESTful API Design**: Clean and consistent routes for all core functionalities.

---

## ✅ Skills Demonstrated

- Real-world backend engineering with **user auth**, **secure media handling**, **connection systems**, and **database modeling**.
- Scalable architecture for **microservice-based** full-stack applications.
- Hands-on experience with **token-based auth**, **Multer-Cloudinary integration**, and **MongoDB querying**.
- Preparedness to work in a **production-grade backend system**.

---

## 📂 Folder Structure

DevConnect_Backend_Microservice/
├── models/
│ ├── User.js
│ └── ConnectionRequest.js
├── routes/
│ ├── auth.js
│ ├── profile.js
│ ├── requests.js
│ └── user.js
├── middleware/
│ ├── auth.js
│ └── upload.js
├── utils/
│ └── cloudinary.js
├── .env
├── app.js


## 🌟 Future Updates

- 💬 **Real-Time Chat Feature**:  
  Will integrate **Socket.IO** to allow users to chat in real time once they are connected — enabling **real-time developer-to-developer communication** just like professional platforms.

---

## ✍️ Author

**Shourya Jain**  