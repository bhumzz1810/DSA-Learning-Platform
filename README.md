# 🧠 DSArena – DSA Learning Platform

DSArena is a full-stack web application designed to help students master Data Structures and Algorithms (DSA) through curated problems, a live code editor, real-time pair programming, and progress tracking.

![DSArena Banner](./client/src/assets/Logo/dsalogo.svg)

---

## 🚀 Features

- 🔒 User & Admin authentication with role-based access
- 🧩 Problem Bank with filtering by topic & difficulty
- ✍️ In-browser code editor with syntax highlighting (Monaco)
- 👥 Live Coding Rooms with file sharing & real-time collaboration (Socket.IO)
- 🧪 Judge0 integration to run code against custom input
- 📈 XP & Leveling system based on solved problems
- 🏆 Leaderboard & Profile stats (planned)
- 🧑‍💻 Admin panel to manage problems (CRUD)

---

## 🛠️ Tech Stack

### Frontend
- ⚛️ React + Vite
- 🎨 Tailwind CSS
- 🧠 Framer Motion
- ✏️ Monaco Editor

### Backend
- 🟢 Node.js + Express
- 🗃️ MongoDB + Mongoose
- 🔐 JWT Auth + bcrypt
- 📡 Socket.IO for real-time code sync

---

## 🔧 Setup Instructions

### 1. Clone Repo

git clone https://github.com/bhumzz1810/DSA-Learning-Platform.git
cd DSA-Learning-Platform


### 2. Setup Backend (server)

cd server
npm install
# Create .env file with:
# PORT=5000
# MONGO_URI=your_mongo_url
# JWT_SECRET=your_secret
npm run dev

### 3. Setup Frontend (client)

cd ../client
npm install
npm run dev


📁 Folder Structure

DSA-Learning-Platform/
├── client/          # React frontend
│   └── src/
│       └── pages/
│       └── components/
├── server/          # Express backend
│   └── models/
│   └── controllers/
│   └── routes/
│   └── middleware/


🧪 Seed Script (Add Problems)
To add multiple problems:

cd server/scripts
node seedProblems.js


👥 Team Members

Bhumil Parate          Full Stack Dev
Vasim Ahmed Choudhary  Frontend Dev
Alshifan	             UI/UX Designer

