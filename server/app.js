const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

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

const cleanupRoom = (roomId) => {
  if (rooms.has(roomId)) {
    const room = rooms.get(roomId);
    const activeUsers = Array.from(room.users.values()).filter(u => u.isActive);
    
    if (activeUsers.length === 0) {
      // Clear all room data
      rooms.delete(roomId);
      io.to(roomId).emit('files-updated', []);
      io.to(roomId).emit('room-cleared');
      console.log(`Room ${roomId} fully cleaned up`);
      return true;
    }
  }
  return false;
};

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
      code: {}
    });
  }

  const room = rooms.get(roomId);
  room.users.set(socket.id, {
    id: socket.id,
    alias,
    isHost: room.users.size === 0,
    isActive: true
  });

  // Notify all users in the room about the updated user list
  io.to(roomId).emit('users-updated', Array.from(room.users.values()));
  
  // Send current files to the new user
  socket.emit('files-updated', room.files);

  // Chat message handler
  socket.on('send-message', (data) => {
    io.to(roomId).emit('new-message', data);
  });

  // File addition handler
  socket.on('files-added', ({ files }) => {
    if (rooms.has(roomId)) {
      const room = rooms.get(roomId);
      room.files.push(...files);
      io.to(roomId).emit('files-updated', room.files);
    }
  });

  // File request handler
  socket.on('request-file', ({ filePath }) => {
    const room = rooms.get(roomId);
    if (room) {
      const file = room.files.find(f => f.path === filePath);
      if (file) {
        const latestCode = room.code[filePath];
        socket.emit('file-content', { 
          filePath, 
          content: latestCode !== undefined ? latestCode : file.content || '' 
        });
      }
    }
  });

  // Code change handler
  socket.on('code-change', ({ filePath, newCode }) => {
    if (!filePath) return;
    const room = rooms.get(roomId);
    if (room) {
      room.code[filePath] = newCode;
      socket.to(roomId).emit('code-update', { filePath, newCode });
    }
  });

  // File save handler
  socket.on('save-file', ({ filePath, content }) => {
    const room = rooms.get(roomId);
    if (room) {
      room.code[filePath] = content;
      const file = room.files.find(f => f.path === filePath);
      if (file) {
        file.content = content;
      }
    }
  });

  // Room clearance handler
  socket.on('clear-room', () => {
    const room = rooms.get(roomId);
    if (room) {
      room.files = [];
      room.code = {};
      io.to(roomId).emit('files-updated', []);
      io.to(roomId).emit('room-cleared');
    }
  });

  // Disconnect handler
  socket.on('disconnect', () => {
    console.log('❌ Disconnected:', socket.id);
    if (rooms.has(roomId)) {
      const room = rooms.get(roomId);
      
      if (room.users.has(socket.id)) {
        // Mark user as inactive
        room.users.get(socket.id).isActive = false;
        io.to(roomId).emit('users-updated', Array.from(room.users.values()));

        // Check if this was the last active user
        const activeUsers = Array.from(room.users.values()).filter(u => u.isActive);
        if (activeUsers.length === 0) {
          cleanupRoom(roomId);
        } else {
          // For non-last users, schedule removal
          setTimeout(() => {
            if (rooms.has(roomId) && room.users.has(socket.id)) {
              room.users.delete(socket.id);
              io.to(roomId).emit('users-updated', Array.from(room.users.values()));
              cleanupRoom(roomId);
            }
          }, 60000);
        }
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`\n✅ Server running on http://localhost:${PORT}`);
  console.log(`📡 Socket.IO ready at ws://localhost:${PORT}/socket.io/`);
});