import {io} from "socket.io-client";

let socket = null;

export const connectSocket = (userId)=>{
    socket = io("https://chat-app-jps9.onrender.com", {
        query:{userId}
    }) 
    return socket;
}

export const getSocket = ()=>socket;

export const disconnectSocket = () =>{
    if(socket){
        socket.disconnect();
        socket = null;
    }

}
