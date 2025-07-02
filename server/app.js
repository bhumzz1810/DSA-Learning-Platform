const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();

// CORS setup
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

// Sample route
app.get("/", (req, res) => {
  res.send("DSA Platform API is running");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
    transports: ['websocket', 'polling']
  },
  path: '/socket.io/',
  serveClient: false,
  pingTimeout: 60000,
  pingInterval: 25000
});

const rooms = new Map();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  const { roomId, alias } = socket.handshake.query;
  if (!roomId || !alias) {
    console.log('Missing roomId or alias. Disconnecting.');
    socket.disconnect();
    return;
  }

  socket.join(roomId);

  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      users: new Map(),
      files: [],
      code: {}  // stores latest code per filePath
    });
  }

  const room = rooms.get(roomId);

  room.users.set(socket.id, {
    id: socket.id,
    alias,
    isHost: room.users.size === 0,
    isActive: true
  });

  io.to(roomId).emit('users-updated', Array.from(room.users.values()));
  io.to(roomId).emit('files-updated', room.files);

  // ✅ Chat
  socket.on('send-message', (data) => {
    console.log('💬 send-message:', data);
    io.to(roomId).emit('new-message', data);
  });

  // ✅ File upload
  socket.on('files-added', ({ roomId, files }) => {
    console.log('📥 files-added:', files);
    if (rooms.has(roomId)) {
      const room = rooms.get(roomId);
      room.files.push(...files);
      io.to(roomId).emit('files-updated', room.files);
    }
  });

  // ✅ File content request
  socket.on('request-file', ({ filePath }) => {
    console.log('📤 request-file:', filePath);
    const room = rooms.get(roomId);
    if (room) {
      const file = room.files.find(f => f.path === filePath);
      if (file) {
        // If code was edited and stored, send latest code, else original content
        const latestCode = room.code[filePath];
        socket.emit('file-content', { filePath, content: latestCode !== undefined ? latestCode : file.content || '' });
      }
    }
  });

  // ✅ Code syncing
  socket.on('code-change', ({ filePath, newCode }) => {
    if (!filePath) return;

    // Save latest code for this file in room state
    room.code[filePath] = newCode;

    // Broadcast code update to all other clients in the room
    socket.to(roomId).emit('code-update', { filePath, newCode });
  });

  // Disconnect cleanup
  socket.on('disconnect', () => {
    console.log('❌ Disconnected:', socket.id);
    if (rooms.has(roomId)) {
      const room = rooms.get(roomId);
      if (room.users.has(socket.id)) {
        room.users.get(socket.id).isActive = false;
        io.to(roomId).emit('users-updated', Array.from(room.users.values()));

        setTimeout(() => {
          if (rooms.has(roomId)) {
            rooms.get(roomId).users.delete(socket.id);
            io.to(roomId).emit('users-updated', Array.from(rooms.get(roomId).users.values()));
            if (rooms.get(roomId).users.size === 0) {
              rooms.delete(roomId);
              console.log('🧹 Room cleaned up:', roomId);
            }
          }
        }, 60000);
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`\n✅ Server running on http://localhost:${PORT}`);
  console.log(`📡 Socket.IO ready at ws://localhost:${PORT}/socket.io/`);
});
