const io = require('socket.io')(server);
const rooms = new Map(); // { roomId: { users: [{ alias, isActive }], files: [...], deleteRequests: { ... } } }

io.on('connection', (socket) => {
  socket.on('join-room', ({ roomId, alias }) => {
    socket.join(roomId);

    if (!rooms.has(roomId)) {
      rooms.set(roomId, { users: [], files: [], deleteRequests: {} });
    }
    const room = rooms.get(roomId);

    // Remove any existing user with same alias before adding new
    room.users = room.users.filter(u => u.alias !== alias);
    room.users.push({ alias, isActive: true });

    io.to(roomId).emit('users-updated', room.users);
    io.to(socket.id).emit('files-updated', room.files);

    console.log(`User ${alias} joined room ${roomId}`);
  });

  socket.on('file-delete-request', ({ roomId, filePath, fileName, requester, deleteRequestId }) => {
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

    const otherUsers = room.users.filter(u => u.alias !== requester && u.isActive);
    if (otherUsers.length === 0) {
      // No other users to approve, delete immediately
      room.files = room.files.filter(f => f.path !== filePath);
      io.to(roomId).emit('file-deleted', { filePath, deleteRequestId });
      io.to(roomId).emit('files-updated', room.files);
      console.log(`File ${filePath} deleted immediately (no other users) in room ${roomId}`);

      delete room.deleteRequests[deleteRequestId];
    } else {
      io.to(roomId).except(socket.id).emit('file-delete-request', { filePath, fileName, requester, deleteRequestId });
      console.log(`Deletion request ${deleteRequestId} for ${filePath} by ${requester} in room ${roomId}`);

      room.deleteRequests[deleteRequestId].timeout = setTimeout(() => {
        room.files = room.files.filter(f => f.path !== filePath);
        io.to(roomId).emit('file-deleted', { filePath, deleteRequestId });
        io.to(roomId).emit('files-updated', room.files);
        console.log(`File ${filePath} auto-deleted (id: ${deleteRequestId}) in room ${roomId}`);

        delete room.deleteRequests[deleteRequestId];
      }, 5000);
    }
  });

  socket.on('file-delete-response', ({ roomId, filePath, approve, responder, deleteRequestId }) => {
    const room = rooms.get(roomId);
    if (!room || !room.deleteRequests[deleteRequestId]) {
      console.error(`Delete request ${deleteRequestId} not found in room ${roomId}`);
      return;
    }

    const deleteRequest = room.deleteRequests[deleteRequestId];
    deleteRequest.responses.push({ approve, responder });

    console.log(`Response ${approve ? 'Yes' : 'No'} from ${responder} for ${filePath} (id: ${deleteRequestId})`);

    const otherUsers = room.users.filter(u => u.alias !== deleteRequest.requester && u.isActive);

    if (deleteRequest.responses.length === otherUsers.length) {
      clearTimeout(deleteRequest.timeout);

      if (deleteRequest.responses.every(r => r.approve)) {
        room.files = room.files.filter(f => f.path !== filePath);
        io.to(roomId).emit('file-deleted', { filePath, deleteRequestId });
        io.to(roomId).emit('files-updated', room.files);
        console.log(`File ${filePath} deleted (id: ${deleteRequestId}) in room ${roomId}`);
      } else {
        io.to(roomId).emit('files-updated', room.files);
        console.log(`Deletion of ${filePath} rejected (id: ${deleteRequestId}) in room ${roomId}`);
      }

      delete room.deleteRequests[deleteRequestId];
    }
  });

  socket.on('files-added', ({ roomId, files }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    // Add new files avoiding duplicates by path
    files.forEach(f => {
      if (!room.files.some(existing => existing.path === f.path)) {
        room.files.push(f);
      }
    });

    io.to(roomId).emit('files-updated', room.files);
    console.log(`Files added to room ${roomId}:`, files.map(f => f.name));
  });

  socket.on('file-renamed', ({ roomId, oldPath, newPath, newName }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    room.files = room.files.map(f =>
      f.path === oldPath ? { ...f, path: newPath, name: newName } : f
    );

    io.to(roomId).emit('file-renamed', { oldPath, newPath, newName });
    io.to(roomId).emit('files-updated', room.files);

    console.log(`File renamed from ${oldPath} to ${newName} in room ${roomId}`);
  });

  socket.on('leave-room', ({ roomId, alias }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    room.users = room.users.map(u =>
      u.alias === alias ? { ...u, isActive: false } : u
    );

    io.to(roomId).emit('users-updated', room.users);

    if (room.users.every(u => !u.isActive)) {
      rooms.delete(roomId);
      io.to(roomId).emit('room-cleared');
      console.log(`Room ${roomId} cleared`);
    }
  });

  // The following events use roomId but it was missing in parameters — added it

  socket.on('code-change', ({ roomId, filePath, newCode }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    room.files = room.files.map(f =>
      f.path === filePath ? { ...f, content: newCode } : f
    );

    io.to(roomId).emit('code-update', { filePath, newCode });
  });

  socket.on('request-file', ({ roomId, filePath }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const file = room.files.find(f => f.path === filePath);
    if (file) {
      socket.emit('file-content', { filePath, content: file.content });
    }
  });

  socket.on('cursor-update', ({ roomId, filePath, position, userId }) => {
    io.to(roomId).emit('cursor-update', { filePath, position, userId });
  });

  socket.on('send-message', ({ roomId, message, alias, timestamp }) => {
    io.to(roomId).emit('new-message', { message, alias, timestamp });
  });

  socket.on('code-executed', ({ roomId, output, executedBy }) => {
    io.to(roomId).emit('code-executed', { output, executedBy });
  });
});
