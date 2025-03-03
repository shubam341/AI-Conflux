import 'dotenv/config.js';
import http from 'http';
import app from './app.js';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

const port = process.env.PORT || 3000;

const server = http.createServer(app);

//socket.io
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

// Middleware for socket authentication
io.use((socket, next) => {
    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];

        if (!token) {
            return next(new Error('Authentication error: No token provided'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return next(new Error('Authentication error: Invalid token'));
        }

        socket.user = decoded;
        next();
    } catch (error) {
        next(new Error('Authentication error: ' + error.message));
    }
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('event', (data) => {
        console.log('Received event:', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});