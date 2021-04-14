import { io } from "socket.io-client";

const socket = io('http://databucket-env.eba-fbg8ah82.us-east-2.elasticbeanstalk.com');


export {socket}