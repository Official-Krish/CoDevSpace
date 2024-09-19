import { Socket } from "socket.io";
import { RoomManager } from "./roomManager";

export interface User {
    socket: Socket;
    name: string;
    id: string;
}

export class UserManager {
    private users: User[];
    private queue: { id: string, socketId: string }[];
    private roomManager: RoomManager;
    
    constructor() {
        this.users = [];
        this.queue = [];
        this.roomManager = new RoomManager();
    }

    addUser(name: string, socket: Socket, id : string) {
        const user = { name, socket, id };
        this.users.push(user);
        this.queue.push({id , socketId: socket.id});
        socket.emit("lobby");
        this.clearQueue()
        this.initHandlers(socket);
    }

    removeUser(socketId: string) {
        const user = this.users.find(x => x.socket.id === socketId);
        
        this.users = this.users.filter(x => x.socket.id !== socketId);
        this.queue = this.queue.filter(x => x.socketId !== socketId);
    }

    clearQueue() {
        console.log("inside clearQueue");
        console.log("Queue length before processing:", this.queue.length);

        // Group users by ID
        const groups: { [key: string]: User[] } = {};
        this.queue.forEach(({ id, socketId }) => {
            const user = this.users.find(u => u.socket.id === socketId);
            if (user) {
                if (!groups[id]) {
                    groups[id] = [];
                }
                groups[id].push(user);
            }
        });

        // Create rooms for each group with more than one user
        Object.values(groups).forEach(usersInGroup => {
            if (usersInGroup.length < 2) {
                return; // Skip if there are fewer than 2 users in the group
            }
            
            const roomId = this.roomManager.createRoom(usersInGroup);
            console.log(`Created room ${roomId} for users with ID ${usersInGroup[0].id}`);

            // Clear the queue for users that have been placed in a room
            const userSockets = usersInGroup.map(user => user.socket.id);
            this.queue = this.queue.filter(({ socketId }) => !userSockets.includes(socketId));
        });

        console.log("Queue length after processing:", this.queue.length);
    }

    
    initHandlers(socket: Socket) {
        socket.on("offer", ({sdp, roomId}: {sdp: string, roomId: string}) => {
            this.roomManager.onOffer(roomId, sdp, socket.id);
        })

        socket.on("answer",({sdp, roomId}: {sdp: string, roomId: string}) => {
            this.roomManager.onAnswer(roomId, sdp, socket.id);
        })

        socket.on("add-ice-candidate", ({candidate, roomId, type}) => {
            this.roomManager.onIceCandidates(roomId, socket.id, candidate, type);
        });
    }

}