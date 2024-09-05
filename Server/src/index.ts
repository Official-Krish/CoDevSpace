import express from 'express';
import { createClient } from 'redis';
import { WebSocketServer } from 'ws';
import { RoomManager } from './utils/roomManager';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const server = app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

const redisClient = createClient({
    url: process.env.REDIS_URL
});

const redisClientSubscribing = createClient({
    url: process.env.REDIS_URL
});

redisClient.connect().catch(err => {
    console.log(err);
    process.exit(1);
})

redisClientSubscribing.connect().catch(err => {
    console.log(err);
    process.exit(1);
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');
    
    ws.on("mesasge", (data, isBinary) => {
        const message = JSON.parse(data.toString());

        if(message.Title === "User-joined"){
            RoomManager.getInstance().handleUserJoined(message, ws);
        }

        if(message.Title === "Lang-change"){
            RoomManager.getInstance().handleLangChange(message);
        }

        if(message.Title === "Code-change"){
            RoomManager.getInstance().handleCodeChange(message);
        }

        if(message.Title === "Submitted"){
            RoomManager.getInstance().handleSubmitted(message);
        }

        if(message.Title === "User-left"){
            RoomManager.getInstance().handleUserLeft(message);
        }

        if(message.Title === "New-chat"){
            RoomManager.getInstance().handleNewChat(message);
        }
    });
    ws.send(JSON.stringify({
        Title : "Connected",
        msg : "Hello! You are connected to the server"
    }));
})

app.post("/create", (req , res ) => {
    const { username , roomName, roomId } = req.body;

    if(!username || !roomName || !roomId){
        res.status(400).send("Invalid request");
        return;
    }

    try{
        RoomManager.getInstance().create(req.body);
        res.status(200).send("Room created");
    } catch(e){
        res.status(500).send("Error creating room");
    }
})




