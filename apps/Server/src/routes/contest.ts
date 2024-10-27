import { Router } from "express";
import { ContestRoomManager } from "../utils/ContestRoomManager";
import { authMiddleware } from "../middleware";
import { prisma } from "../utils/db";

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

ContestRouter.post("/winner", async (req, res) => {
    const { userId } = req.body;
    
    if (!userId) {
        console.error("No userId provided");
        return res.status(400).send("User ID is required."); 
    }
    try{
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if(!user){
            res.status(400).send("Invalid user");
            return;
        }

        const updateParticipant = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                Contest_Points: user.Contest_Points + 10,
                Total_Contests: user.Total_Contests + 1
            }
        });

        res.status(200).json(updateParticipant);
    } catch(e){
        res.status(500).send("Error declaring winner");
    }
})

ContestRouter.post("/lost", async (req, res) => {
    const { userId } = req.body;
    
    if (!userId) {
        console.error("No userId provided");
        return res.status(400).send("User ID is required."); 
    }
    try{
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if(!user){
            res.status(400).send("Invalid user");
            return;
        }

        const updateParticipant = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                Contest_Points: user.Contest_Points - 5,
                Total_Contests: user.Total_Contests + 1
            }
        });

        res.status(200).json(updateParticipant);
    } catch(e){
        res.status(500).send("Error declaring loser");
    }
})

ContestRouter.get("/getLeaderboard", async (req, res) => {
    try{
        const leaderboard = await prisma.user.findMany({
            select: {
                name: true,
                Contest_Points: true,
                Total_Contests: true,
            },
            orderBy: {
                Contest_Points: "desc"
            }
        });

        res.json(leaderboard);
    } catch(e){
        res.status(500).send("Error fetching leaderboard");
    }
})