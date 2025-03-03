import socket from 'socket.io-client'


let socketInstance=null;


//for authentication user
export const initializeSocket=(projectId)=>{
    socketInstance=socket(import.meta.env.VITE_API_URL,{
        auth:{
            token:localStorage.getItem('token')
        },
        query:{
            projectId
        }
    });

    return socketInstance;
} 



//function for receive message
export const receiveMessage=(eventName, cb)=>{
    socketInstance.emit(eventName,cb);
}


export const sendMessage=(eventName, data)=>{
    socketInstance.emit(eventName,data);
}