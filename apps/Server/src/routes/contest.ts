import { Router } from "express";
import { ContestRoomManager } from "../utils/ContestRoomManager";

export const ContestRouter = Router();

ContestRouter.post("/poll", (req, res) => {
    const { userId } = req.body; 
    
    if (!userId) {
        console.error("No userId provided");
        return res.status(400).send("User ID is required."); 
    }
    ContestRoomManager.getInstance().won(userId);
    
    res.status(200).send("Poll request processed for userId: " + userId);
});

ContestRouter.get("/getContests", async ( req, res ) => {
    try{
        const rooms = await ContestRoomManager.getInstance().getRooms();
        res.json(rooms);
    } catch(e){
        res.json(e);
    }
}) 