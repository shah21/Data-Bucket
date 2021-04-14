import { io } from "socket.io-client";

const socket = io('https://databucket.azurewebsites.net/');


export {socket}