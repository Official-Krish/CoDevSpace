import express from 'express';
import { createClient } from 'redis';
import { WebSocketServer } from 'ws';
import { RoomManager } from './utils/roomManager';
import cors from 'cors';
import { userRouter } from './routes/user';
import cookieParser from 'cookie-parser';
import { qustnRouter } from './routes/getQstn';
import { aiRouter } from './routes/AiChat';
import { problemRouter } from './routes/getProblem';
import { SubmissionRouter } from './routes/Submission';
import { ContestRoomManager } from './utils/ContestRoomManager';
import { ContestRouter } from './routes/contest';

const app = express();
app.use(express.json());
app.use(cors({
  credentials: true,
  origin: "http://localhost:5173"
}));
app.use(cookieParser());

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

const wss = new WebSocketServer({ server: server });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data, isBinary) {
    const message = JSON.parse(data.toString());
    if(message.Title==="User-joined"){
      RoomManager.getInstance().handleUserJoined(message, ws);
    }
    else if(message.Title==="User-left"){
      RoomManager.getInstance().handleUserLeft(message)
    }
    else if(message.Title==="New-chat"){
      RoomManager.getInstance().handleNewChat(message)
    }
    else if(message.Title==="lang-change"){
      RoomManager.getInstance().handleLangChange(message)
    }
    else if(message.Title==="Code-change"){
      RoomManager.getInstance().handleCodeChange(message)
    }
    else if(message.Title==="Submitted"){
      RoomManager.getInstance().handleSubmitted(message)
    }

    else if (message.Title === "Join-Contest-Room"){
      ContestRoomManager.getInstance().handleUserJoined(message, ws);
    }
  });

  ws.send(JSON.stringify({Title : "Greet" , msg:'Hello! Message From Server!!'}));
});

app.post("/api/create", (req , res ) => {
    const { username , roomName, roomId } = req.body;

    if(!username || !roomName || !roomId){
        res.status(400).send("Invalid request");
        return;
    }

    try{
      RoomManager.getInstance().create(req.body);
      res.status(200).send("Room created");
      console.log("Room created");
    } catch(e){
        res.status(500).send("Error creating room");
    }
})

app.post("/api/createContest", (req , res ) => {
    const { username, roomName, roomId, problemId, friends, participantCount } = req.body;

    if(!username || !roomName || !roomId || !problemId || !participantCount){
        res.status(400).send("Invalid request");
        return;
    }

    try{
        ContestRoomManager.getInstance().create(req.body);
        res.status(200).send("Room created");
        console.log("Room created");
    } catch(e){
        res.status(500).send("Error creating room");
    }
});


app.use("/api/v1/user", userRouter);
app.use("/api/v1/getQustn", qustnRouter);
app.use("/api/v1/AIchat", aiRouter);
app.use("/api/v1/problem", problemRouter);
app.use("/api/v1/submission", SubmissionRouter)
app.use("/api/v1/contest", ContestRouter);


