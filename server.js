import express from 'express';
import http from 'http';
import {Server} from 'socket.io';
import { nanoid } from 'nanoid'; // Import nanoid

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    // Generate a unique user ID for each connection
    const userId = nanoid(4);
    let userName = '';

    console.log(`User connected: ${userId}`);

    // Send the user ID to the client when they connect
    socket.emit('user id', userId);

    // Receive the name from the client
    socket.on('set name', (name) => {
        userName = name; // Store the user's name
        socket.emit('user name', userName); // Send the name to the client
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${userId}`);
    });

    socket.on('chat message', (msg) => {
        // Broadcast the message along with the user ID and name to all connected clients
        io.emit('chat message', { userId, userName, msg });
    });
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
