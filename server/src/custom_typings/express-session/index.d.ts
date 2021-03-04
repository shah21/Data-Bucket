import session from 'express-session';

declare module 'express-session' {
  export interface SessionData {
    socketId: string;
    demo:string;
  }
}