import { Router } from "express";
import { ContestRoomManager } from "../utils/ContestRoomManager";
import { authMiddleware } from "../middleware";

export const ContestRouter = Router();

ContestRouter.use(authMiddleware);

ContestRouter.post("/poll", (req, res) => {
    const { userId } = req.body; 
    
    if (!userId) {
        console.error("No userId provided");
        return res.status(400).send("User ID is required."); 
    }
    ContestRoomManager.getInstance().won(userId);
    
    res.status(200).send("Poll request processed for userId: " + userId);
});

ContestRouter.post("/createContest", (req , res ) => {
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

ContestRouter.get("/getContests", async ( req, res ) => {
    try{
        const rooms = await ContestRoomManager.getInstance().getRooms();
        res.json(rooms);
    } catch(e){
        res.json(e);
    }
}) 