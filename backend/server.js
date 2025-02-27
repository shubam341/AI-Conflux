import 'dotenv/config.js'
import http from 'http';
import app from './app.js';
import { Server } from 'socket.io';

const port=process.env.PORT || 3000;

const server=http.createServer(app);

//sockiet.io
const io = new Server(server);

io.on('connection', socket => {
    console.log('a user connected');
  socket.on('event', data => { /* … */ });
  socket.on('disconnect', () => { /* … */ });
});



server.listen(3000,()=>{
    console.log(`Server is running on port${port}`);
})