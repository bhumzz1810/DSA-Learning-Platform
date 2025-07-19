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
        deleteRequests: {},
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
    socket.emit("files-updated", room.files.filter(f => f.path && f.name));

    socket.on("send-message", (data) => {
      if (typeof data.message !== "string" || !data.alias) return;
      io.to(roomId).emit("new-message", data);
    });

    socket.on("files-added", ({ roomId: rid, files }) => {
      if (rid !== roomId) return;
      if (!rooms.has(roomId)) return;
      const room = rooms.get(roomId);
      const validFiles = files.filter(
        f => f.path && f.name && !room.files.some(existing => existing.path === f.path)
      );
      if (validFiles.length === 0) {
        console.log(`No valid files to add in room ${roomId}`, files);
        return;
      }
      room.files.push(...validFiles);
      io.to(roomId).emit("files-updated", room.files);
      console.log(`Files added to room ${roomId}:`, validFiles.map(f => f.name));
    });

    socket.on("request-file", ({ filePath }) => {
      if (!filePath) return;
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
      if (!filePath || typeof newCode !== "string") return;
      const room = rooms.get(roomId);
      if (room) {
        room.code[filePath] = newCode;
        socket.to(roomId).emit("code-update", { filePath, newCode });
      }
    });

    socket.on("save-file", ({ filePath, content }) => {
      if (!filePath || typeof content !== "string") return;
      const room = rooms.get(roomId);
      if (room) {
        room.code[filePath] = content;
        const file = room.files.find((f) => f.path === filePath);
        if (file) {
          file.content = content;
        }
      }
    });

    socket.on("file-delete-request", ({ roomId: rid, filePath, fileName, requester, deleteRequestId }) => {
      if (rid !== roomId || !filePath || !fileName || !deleteRequestId) return;
      const room = rooms.get(roomId);
      if (!room) {
        console.error(`Room ${roomId} not found`);
        return;
      }
      room.deleteRequests[deleteRequestId] = {
        filePath,
        fileName,
        requester,
        responses: [],
        timeout: null,
      };
      const otherUsers = Array.from(room.users.values()).filter(
        u => u.alias !== requester && u.isActive
      );
      if (otherUsers.length === 0) {
        room.files = room.files.filter(f => f.path !== filePath);
        delete room.code[filePath];
        io.to(roomId).emit("file-deleted", { filePath, deleteRequestId });
        io.to(roomId).emit("files-updated", room.files);
        console.log(`File ${filePath} deleted immediately (no other users, id: ${deleteRequestId}) in room ${roomId}`);
        delete room.deleteRequests[deleteRequestId];
      } else {
        socket.to(roomId).emit("file-delete-request", { filePath, fileName, requester, deleteRequestId });
        console.log(`Deletion request ${deleteRequestId} for ${filePath} by ${requester} in room ${roomId}`);
        room.deleteRequests[deleteRequestId].timeout = setTimeout(() => {
          room.files = room.files.filter(f => f.path !== filePath);
          delete room.code[filePath];
          io.to(roomId).emit("file-deleted", { filePath, deleteRequestId });
          io.to(roomId).emit("files-updated", room.files);
          console.log(`File ${filePath} auto-deleted (id: ${deleteRequestId}) in room ${roomId}`);
          delete room.deleteRequests[deleteRequestId];
        }, 5000);
      }
    });

    socket.on("file-delete-response", ({ roomId: rid, filePath, approve, responder, deleteRequestId }) => {
      if (rid !== roomId || !filePath || !deleteRequestId) return;
      const room = rooms.get(roomId);
      if (!room || !room.deleteRequests[deleteRequestId]) {
        console.error(`Delete request ${deleteRequestId} not found in room ${roomId}`);
        return;
      }
      room.deleteRequests[deleteRequestId].responses.push({ approve, responder });
      console.log(`Response ${approve ? 'Yes' : 'No'} from ${responder} for ${filePath} (id: ${deleteRequestId})`);

      const otherUsers = Array.from(room.users.values()).filter(
        u => u.alias !== room.deleteRequests[deleteRequestId].requester && u.isActive
      );
      if (room.deleteRequests[deleteRequestId].responses.length === otherUsers.length) {
        clearTimeout(room.deleteRequests[deleteRequestId].timeout);
        if (room.deleteRequests[deleteRequestId].responses.every(r => r.approve)) {
          room.files = room.files.filter(f => f.path !== filePath);
          delete room.code[filePath];
          io.to(roomId).emit("file-deleted", { filePath, deleteRequestId });
          io.to(roomId).emit("files-updated", room.files);
          console.log(`File ${filePath} deleted (id: ${deleteRequestId}) in room ${roomId}`);
        } else {
          io.to(roomId).emit("files-updated", room.files);
          console.log(`Deletion of ${filePath} rejected (id: ${deleteRequestId}) in room ${roomId}`);
        }
        delete room.deleteRequests[deleteRequestId];
      }
    });

    socket.on("file-renamed", ({ roomId: rid, oldPath, newPath, newName }) => {
      if (rid !== roomId || !oldPath || !newPath || !newName) return;
      const room = rooms.get(roomId);
      if (room) {
        room.files = room.files.map(f => f.path === oldPath ? { ...f, path: newPath, name: newName } : f);
        if (room.code[oldPath]) {
          room.code[newPath] = room.code[oldPath];
          delete room.code[oldPath];
        }
        io.to(roomId).emit("file-renamed", { oldPath, newPath, newName });
        io.to(roomId).emit("files-updated", room.files);
        console.log(`File renamed from ${oldPath} to ${newName} in room ${roomId}`);
      }
    });

    socket.on("cursor-update", ({ filePath, position, userId }) => {
      if (!filePath || !position || !userId) return;
      socket.to(roomId).emit("cursor-update", { filePath, position, userId });
    });

    socket.on("code-executed", ({ roomId: rid, output, executedBy }) => {
      if (rid !== roomId || !output || !executedBy) return;
      io.to(roomId).emit("code-executed", { output, executedBy });
    });

    socket.on("clear-room", () => {
      const room = rooms.get(roomId);
      if (room) {
        room.files = [];
        room.code = {};
        room.deleteRequests = {};
        io.to(roomId).emit("files-updated", []);
        io.to(roomId).emit("room-cleared");
        console.log(`Room ${roomId} cleared`);
      }
    });

    socket.on("leave-room", ({ roomId: rid, alias }) => {
      if (rid !== roomId) return;
      if (rooms.has(roomId)) {
        const room = rooms.get(roomId);
        if (room.users.has(socket.id)) {
          room.users.get(socket.id).isActive = false;
          io.to(roomId).emit("users-updated", Array.from(room.users.values()));
          cleanupRoom(roomId, io);
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected:", socket.id);
      if (rooms.has(roomId)) {
        const room = rooms.get(roomId);
        if (room.users.has(socket.id)) {
          room.users.get(socket.id).isActive = false;
          io.to(roomId).emit("users-updated", Array.from(room.users.values()));
          cleanupRoom(roomId, io);
        }
      }
    });
  });

  return io;
}

module.exports = setupSocketServer;