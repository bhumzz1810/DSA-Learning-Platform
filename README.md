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

cd server<br>
npm install<br>
Create .env file with:<br>
PORT=5000<br>
MONGO_URI=your_mongo_url<br>
JWT_SECRET=your_secret<br>
npm run dev<br>

### 3. Setup Frontend (client)

cd ../client<br>
npm install<br>
npm run dev<br>


📁 Folder Structure

DSA-Learning-Platform/<br>
├── client/          # React frontend<br>
│   └── src/<br>
│       └── pages/<br>
│       └── components/<br>
├── server/          # Express backend<br>
│   └── models/<br>
│   └── controllers/<br>
│   └── routes/<br>
│   └── middleware/<br>


🧪 Seed Script (Add Problems)
To add multiple problems:<br>

cd server/scripts<br>
node seedProblems.js<br>


👥 Team Members

Bhumil Parate          Full Stack Dev<br>
Vasim Ahmed Choudhary  Frontend Dev<br>
Alshifan	             UI/UX Designer<br>

