import { io } from "socket.io-client";

const socket = io('http://192.168.1.6:8080');


export {socket}