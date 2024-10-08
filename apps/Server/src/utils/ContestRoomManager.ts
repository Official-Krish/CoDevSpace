import { WebSocket } from 'ws'

interface RoomData {
    roomId: string;
    roomName: string
    host: string;
    users: Array<{
        username: string,
        userId: string,
        ws: WebSocket
    }>,
    problemId: string | null;
}

class ContestRoomManager {
    private static instance : ContestRoomManager;
    private rooms : RoomData[] = [];

    private constructor() {
    }

    public static getInstance(): ContestRoomManager {
        if (!ContestRoomManager.instance) {
            ContestRoomManager.instance = new ContestRoomManager();
        }
        return ContestRoomManager.instance;
    }

    public async create({ username, roomId, roomName, problemId }: { username: string, roomName: string, roomId: string, problemId: string }) {
        const newRoom: RoomData = {
            roomId,
            roomName: roomName,
            host: username,
            users: [],
            problemId: problemId, 
        };
        this.rooms.push(newRoom);
    }

    public async handleUserJoined(message : any, ws : WebSocket) {
        let { roomId, username, userId } = message;
        roomId = Array.isArray(roomId) ? roomId[0] : roomId;

        const room = this.rooms.find(room => room.roomId === roomId);
        if (!room) {
                const notFoundMessage = JSON.stringify({
                Title : "Not-found"
            })
            ws.send(notFoundMessage)
            return;
        }
  
  
        // Check if the user is already in the room
        const existingUserIndex = room.users.findIndex(user => user.username === username);
        if (existingUserIndex !== -1) {
            room.users[existingUserIndex].ws = ws;
    
            const roomInfoMessage = JSON.stringify({
                Title: "Room-Info",
                roomId,
                users: room.users.map(user => user.username),
            });
            ws.send(roomInfoMessage);
            return;
        }
    
        // Add the user to the room
        room.users.push({ username, ws, userId });
    
        // Send a message to all other users in the room about the new user
        const newUserMessage = JSON.stringify({
            Title: "Contest-user-joined",
            username
        });
    
        room.users.forEach(user => {
            if (user.ws !== ws && user.ws.readyState === WebSocket.OPEN) {
                user.ws.send(newUserMessage);
            }
        });
    
        // Send room info to the newly joined user
        const roomInfoMessage = JSON.stringify({
            Title: "Room-Info",
            roomId,
            users: room.users.map(user => {
                user.username
                user.userId
            }),
            roomName : room.roomName,
            problemId : room.problemId
        });
        ws.send(roomInfoMessage);
    }    

    public async won (userId: string) {
        const room = this.rooms.find(room => 
            room.users.some(user => user.userId === userId)
        );
    
        if (!room) {
            return;
        }
    
        const winningUser = room.users.find(user => user.userId === userId);
        
        if (winningUser && winningUser.ws) {
            try {
                winningUser.ws.send(JSON.stringify({
                    Title: "Contest-won"
                }));
            } catch (error) {
                console.error("Error sending message to the winning user:", error);
            }
        }
    
        const otherUsers = room.users.filter(user => user.userId !== userId);
    
        otherUsers.forEach(user => {
            if (user.ws) {
                try {
                    user.ws.send(JSON.stringify({
                        Title: "Contest-Loss"
                    }));
                } catch (error) {
                    console.error(`Error sending message to user ${user.userId}:`, error);
                }
            }
        });
    }
    

}

export { ContestRoomManager };
