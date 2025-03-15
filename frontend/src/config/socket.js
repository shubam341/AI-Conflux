import socket from 'socket.io-client';

let socketInstance = null;

// Initialize Socket with Authentication
export const initializeSocket = (projectId) => {
    if (!socketInstance) {  // Prevent re-initialization
        socketInstance = socket(import.meta.env.VITE_API_URL, {
            auth: {
                token: localStorage.getItem('token')
            },
            query: {
                projectId
            }
        });
    }
    return socketInstance;
};

// Function to receive messages
export const receiveMessage = (eventName, cb) => {
    if (socketInstance) {
        socketInstance.on(eventName, cb);  //  Correct: Use `.on()` to listen for events
    };
};

// Function to send messages
export const sendMessage = (eventName, data) => {
    if (socketInstance) {
        socketInstance.emit(eventName, data);  
    }
};
