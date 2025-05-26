import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_CLEAN_API_URL, {
  withCredentials: true,
  transports: ["websocket"],
});

export default socket;
