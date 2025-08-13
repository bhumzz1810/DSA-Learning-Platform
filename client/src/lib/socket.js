import { io } from "socket.io-client";

const URL =
  process.env.NODE_ENV === "production"
    ? undefined
    : "https://dsa-learning-platform-316y.onrender.com";

export const socket = io(URL, {
  autoConnect: false,
});
