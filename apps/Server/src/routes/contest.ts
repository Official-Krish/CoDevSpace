import { Router } from "express";
import { ContestRoomManager } from "../utils/ContestRoomManager";

export const ContestRouter = Router();

ContestRouter.post("/poll", ( req, res ) => {
    const userId = req.body;
    ContestRoomManager.getInstance().won(userId);
})