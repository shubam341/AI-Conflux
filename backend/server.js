import 'dotenv/config.js';
import http from 'http';
import app from './app.js';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import projectModel from './models/project.model.js'

const port = process.env.PORT || 3000;

const server = http.createServer(app);

//socket.io
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

// Middleware for socket authentication
io.use(async(socket, next) => {
    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];

      //when socket connect it automatically connected to the room
      const projectId=socket.handshake.query.projectId;
      //cheecking  mongoose id valid
      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return next(new Error('Invalid projectId'));
      }
      

      socket.project=await projectModel.findById(projectId)

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

    socket.roomId=socket.project._id.toString();

    console.log('A user connected');

    socket.join(socket.roomId);

    socket.on('project-message',data=>{
        console.log(data);
      socket.broadcast.to(socket.roomId).emit('project-message',data)
    });

    socket.on('event', (data) => {
        console.log('Received event:', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
        socket.leave(socket.roomId)
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});