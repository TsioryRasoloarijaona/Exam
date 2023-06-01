const express = require('express');
const app = express();
const { Server } = require("socket.io");

const http = require('http');
const { table } = require('console');
const { disconnect } = require('process');
const { SocketAddress } = require('net');
const server = http.createServer(app);

const io = new Server(server);

app.use(express.static(__dirname))

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

let userlist = {};


io.on('connection', (socket) => {
    console.log('a user is connected');


    socket.on("room", (room) => {
        socket.join(room)
        socket.on("user", (user) => {
            userlist[socket.id] = user
            socket.broadcast.to(room).emit("user-join", user);
            console.table(userlist);


        })
        socket.on("msg", (message) => {
            socket.broadcast.to(room).emit("sendmsg", {
                message: message,
                username: userlist[socket.id]
            });

        })

        socket.on('delete', message =>{
            
            socket.broadcast.to(room).emit("delete-msg", message)
        })

        socket.on("disconnect", () => {
            socket.broadcast.to(room).emit('leave',  {user:userlist[socket.id]})
            delete userlist[socket.id];
            console.table(userlist)
        })



    })



})





server.listen(3000, () => {
    console.log('listening port 4000');
})