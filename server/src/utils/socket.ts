import * as socketio from 'socket.io';
import { Server } from "http";

let socket:socketio.Server;

export default {
    init:(httpServer:Server):socketio.Server =>{
        const socket = require('socket.io')(httpServer,{
            cors: {
              origin: "http://localhost:3000",
              credentials: true
            }});
        return socket;
    },
    getIO:()=>{
        if(!socket){
            throw new Error('No socket initialized');
        }
        return socket;
    }
}