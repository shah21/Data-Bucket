import { io } from "socket.io-client";

const socket = io('http://192.168.1.5:8080');


export {socket}