const dotenv = require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const routes = require('./routes/index');

const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(express.static('uploads'))
//router
app.use('/api', routes);

// Error
app.use(errorMiddleware);

// CONSTANTS
const PORT = process.env.PORT || 8080;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

async function start() {
    try {
        await mongoose.connect(
            `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.vrdxxen.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
        );
        app.listen(PORT, () => console.log(`Server started at port: ${PORT}`))
    } catch (err) {
        console.log(err);
    }
}

start();

const { Chat } = require('./models/Chat');

const io = require('socket.io')(3000, {
    cors: {
        origin: '*'
    }
});

io.on("connection", socket => {
    socket.on('connect-to', (room) => {
        socket.join(room);
    });

    socket.on('send-message', (message, _id, room) => {
        const newMessage = {
            sender: _id,
            text: message,
            created_date: new Date().toLocaleDateString()
        };

        (async () => {
            await Chat.findByIdAndUpdate(room, {$push: {
                    messages: newMessage
            }});
        })();

        socket.to(room).emit('receive-message', newMessage);
    });
});
