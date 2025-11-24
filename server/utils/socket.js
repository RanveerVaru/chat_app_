import { Server } from "socket.io";

const userSocketMap = {}

let io;

export function initSocket(server) {
    io = new Server(server, {
        cors : {
            origin : process.env.FRONTEND_URL,
        },
        
    });

    io.on("connection", (socket) => { //Runs every time a new client connects to the server.
        // console.log("a user connected" , socket);
        const userId = socket.handshake.query.userId;
        // console.log("userid : ",userId)
        if(userId) {
            userSocketMap[userId] = socket.id;
        }
    
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); //Send an event to EVERY connected client.
        socket.on("disconnect", () => { //Disconnect this particular socket.
            console.log("a user disconnected");
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        });
    });

    
}

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

export {io};
