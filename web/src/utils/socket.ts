import { io } from "socket.io-client";

const socket = io('http://databucket-env-1.eba-mxjyzwxn.eu-west-3.elasticbeanstalk.com');


export {socket}