class WebSockets {
    users:Array<{socketId:string,userId:string}> = [];

    constructor(){
        this.connection = this.connection.bind(this); 
    }
    
    connection(client:any) {
      // event fired when the  room is disconnected
      client.on("disconnect", () => {
        this.users = this.users.filter((user) => user.socketId !== client.id);
      });
      // add identity of user mapped to the socket id
      client.on("identity", (data:{userId:string}) => {
        const isAvailable = this.users.find(x=>{
            return x.socketId === client.id; 
        });
        if (!isAvailable) {
          this.users.push({
            socketId: client.id,
            userId: data.userId,
          });
        }
      });
      // subscribe person to chat & other user as well
      client.on("subscribe", (room: string) => {
        if(!Object.keys(client.rooms).includes(room)){
          client.join(room);
          // console.log(global.io.sockets.adapter.rooms);
        }  
        
      });

      // mute a chat room
      client.on("unsubscribe", (room:string) => {
        client.leave(room);
      });
    }
  
    subscribeOtherUser(room:string, otherUserId:string) {
      const userSockets = this.users.filter(
        (user) => user.userId === otherUserId
      );
      userSockets.map((userInfo) => {
        const socketConn = global.io.sockets.sockets.get(userInfo.socketId);
        if(socketConn){
          socketConn.join(room);
        }
      });
    }
  }
  
  export default new WebSockets();