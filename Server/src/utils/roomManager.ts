import { createClient } from "redis";
import { WebSocket } from "ws";

interface room {
    name : string;
    roomId : string;
    users : Array<{
        username : string;
        ws : WebSocket;
    }>;

    code : string;
    chats : Array<{
        username : string;
        message : string;
    }>;
    language : string;
    result : string;
}


export class RoomManager {
    private static instance : RoomManager;
    private rooms : room[] = [];

    private constructor() {}


    public static getInstance() : RoomManager {
        if(!RoomManager.instance){
            RoomManager.instance = new RoomManager();
        }
        return RoomManager.instance;
    }

    create(roomData : any){
        const {username, roomName, roomId} = roomData;

        const newRoom : room = {
            name : roomName,
            roomId,
            users : [],
            code : "",
            chats : [],
            language : "C++",
            result : ""
        }

        this.rooms.push(newRoom);
    }

    handleUserJoined(message : any, ws : WebSocket){
        const {username, roomId} = message;

        const room = this.rooms.find(room => room.roomId === roomId);

        if(!room){
            const notFoundMessage = JSON.stringify({
                Title : "Room-not-found",
            });
            ws.send(notFoundMessage);
            return;
        }

        const existingUserIndex = room.users.findIndex(user => user.username === username);

        if (existingUserIndex !== -1){
            room.users[existingUserIndex].ws = ws;

            const roomInfoMessage = JSON.stringify({
                Title : "Room-info",
                roomId : room.roomId,
                roomName : room.name,
                users : room.users.map(user => user.username),
                code : room.code,
                chats : room.chats,
                language : room.language,
                result : room.result
            });
            ws.send(roomInfoMessage);
            return;
        }

        room.users.push({ username, ws });

        const newuserJoinedMessage = JSON.stringify({
            Title : "New_User",
            username
        });

        room.users.forEach(user => {
            if (user.ws !== ws && user.ws.readyState === WebSocket.OPEN) {
              user.ws.send(newuserJoinedMessage);
            }
        });

        const roomInfoMessage = JSON.stringify({
            Title : "Room-info",
            roomId : room.roomId,
            roomName : room.name,
            users : room.users.map(user => user.username),
            code : room.code,
            chats : room.chats,
            language : room.language,
            result : room.result
        });

        ws.send(roomInfoMessage);
    }


    handleUserLeft(message : any){
        const { username, roomId } = message;

        const room = this.rooms.find(room => room.roomId === roomId);

        if(!room){
            return;
        }

        room.users = room.users.filter(user => user.username !== username);

        const userLeftMessage = JSON.stringify({
            Title : "User-left",
            username,
            user: room.users.map(user => user.username)
        });

        room.users.forEach(user => {
            if(user.ws.readyState === WebSocket.OPEN){
                user.ws.send(userLeftMessage);
            }
        });
    }

    handleNewChat(message : any){
        const { roomId, username, chat} = message;

        const room = this.rooms.find(room => room.roomId === roomId);
        if(!room){
            return;
        }

        room.chats.push({ username, message : chat });

        const newChatMessage = JSON.stringify({
            Title : "New-chat",
            username,
            message : chat
        });

        room.users.forEach(user => {
            if(user.ws.readyState === WebSocket.OPEN){
                user.ws.send(newChatMessage);
            }
        });
    }

    handleLangChange(message : any){
        const { roomId, lang } = message;

        const room = this.rooms.find(room => room.roomId === roomId);
        if(!room){
            return;
        }

        room.language = lang;

        const langChangeMessage = JSON.stringify({
            Title : "Lang-change",
            lang
        });

        room.users.forEach(user => {
            if(user.ws.readyState === WebSocket.OPEN){
                user.ws.send(langChangeMessage);
            }
        });
    }

    handleCodeChange(message : any){
        const { roomId, code } = message;

        const room = this.rooms.find(room => room.roomId === roomId);
        if(!room){
            return;
        }

        room.code = code;

        const codeChangeMessage = JSON.stringify({
            Title : "Code-change",
            code
        });

        room.users.forEach(user => {
            if(user.ws.readyState === WebSocket.OPEN){
                user.ws.send(codeChangeMessage);
            }
        });
    }

    async handleSubmitted( message : any){
        const REDIS_URL = process.env.REDIS_URL;

        const redisClient = createClient({
            url: REDIS_URL
        });

        const redisClientSubscribing = createClient({
            url: REDIS_URL
        });

        redisClient.connect().catch(err => {
            console.log(err);
            process.exit(1);
        })

        redisClientSubscribing.connect().catch(err => {
            console.log(err);
            process.exit(1);
        });

        const { roomId } = message;
        const room = this.rooms.find(room => room.roomId === roomId);

        if(!room){
            return;
        }

        const SubmitClickedMessage = JSON.stringify({
            Title : "Submit-Clicked"
        });

        room.users.forEach(user => {
            if(user.ws.readyState === WebSocket.OPEN){
                user.ws.send(SubmitClickedMessage);
            }
        });

        await redisClient.lPush("submissions", JSON.stringify(message));

        redisClientSubscribing.subscribe(roomId, (result) => {
            console.log(result);

            redisClientSubscribing.unsubscribe(roomId);

            const parsedResult = JSON.parse(result);

            const ResultMessage = {
                Title : "Result",
                stdout : parsedResult.stdout,
                stderr : parsedResult.stderr,
                status : parsedResult.status,
                compile_output : parsedResult.compile_output
            };

            room.users.forEach(user => {
                if(user.ws.readyState === WebSocket.OPEN){
                    user.ws.send(JSON.stringify(ResultMessage));
                }
            });
        })
    }
}