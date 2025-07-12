// socketHandler.js
const { Server } = require("socket.io");

const rooms = new Map();

const cleanupRoom = (roomId, io) => {
  if (rooms.has(roomId)) {
    const room = rooms.get(roomId);
    const activeUsers = Array.from(room.users.values()).filter(
      (u) => u.isActive
    );

    if (activeUsers.length === 0) {
      rooms.delete(roomId);
      io.to(roomId).emit("files-updated", []);
      io.to(roomId).emit("room-cleared");
      console.log(`Room ${roomId} fully cleaned up`);
      return true;
    }
  }
  return false;
};

function setupSocketServer(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
      transports: ["websocket", "polling"],
    },
    path: "/socket.io/",
    serveClient: false,
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
    const { roomId, alias } = socket.handshake.query;

    if (!roomId || !alias) {
      console.log("Missing roomId or alias. Disconnecting.");
      socket.disconnect();
      return;
    }

    socket.join(roomId);

    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        users: new Map(),
        files: [],
        code: {},
      });
    }

    const room = rooms.get(roomId);
    room.users.set(socket.id, {
      id: socket.id,
      alias,
      isHost: room.users.size === 0,
      isActive: true,
    });

    io.to(roomId).emit("users-updated", Array.from(room.users.values()));
    socket.emit("files-updated", room.files);

    socket.on("send-message", (data) => {
      io.to(roomId).emit("new-message", data);
    });

    socket.on("files-added", ({ files }) => {
      if (rooms.has(roomId)) {
        const room = rooms.get(roomId);
        room.files.push(...files);
        io.to(roomId).emit("files-updated", room.files);
      }
    });

    socket.on("request-file", ({ filePath }) => {
      const room = rooms.get(roomId);
      if (room) {
        const file = room.files.find((f) => f.path === filePath);
        if (file) {
          const latestCode = room.code[filePath];
          socket.emit("file-content", {
            filePath,
            content: latestCode !== undefined ? latestCode : file.content || "",
          });
        }
      }
    });

    socket.on("code-change", ({ filePath, newCode }) => {
      if (!filePath) return;
      const room = rooms.get(roomId);
      if (room) {
        room.code[filePath] = newCode;
        socket.to(roomId).emit("code-update", { filePath, newCode });
      }
    });

    socket.on("save-file", ({ filePath, content }) => {
      const room = rooms.get(roomId);
      if (room) {
        room.code[filePath] = content;
        const file = room.files.find((f) => f.path === filePath);
        if (file) {
          file.content = content;
        }
      }
    });

    socket.on("clear-room", () => {
      const room = rooms.get(roomId);
      if (room) {
        room.files = [];
        room.code = {};
        io.to(roomId).emit("files-updated", []);
        io.to(roomId).emit("room-cleared");
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected:", socket.id);
      if (rooms.has(roomId)) {
        const room = rooms.get(roomId);
        if (room.users.has(socket.id)) {
          room.users.get(socket.id).isActive = false;
          io.to(roomId).emit("users-updated", Array.from(room.users.values()));

          const activeUsers = Array.from(room.users.values()).filter(
            (u) => u.isActive
          );
          if (activeUsers.length === 0) {
            cleanupRoom(roomId, io);
          } else {
            setTimeout(() => {
              if (rooms.has(roomId) && room.users.has(socket.id)) {
                room.users.delete(socket.id);
                io.to(roomId).emit(
                  "users-updated",
                  Array.from(room.users.values())
                );
                cleanupRoom(roomId, io);
              }
            }, 60000);
          }
        }
      }
    });
  });

  return io;
}

module.exports = setupSocketServer;
