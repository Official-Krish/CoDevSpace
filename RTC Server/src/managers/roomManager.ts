import { User } from "./usermanager";



interface Room {
    users : User[]
}

export class RoomManager {
    private rooms: Map<string, Room>
    constructor() {
        this.rooms = new Map<string, Room>()
    }


    createRoom(users: User[]) {
        const roomId = users[0].id;
        this.rooms.set(roomId, { users });

        users.forEach(user => user.socket.emit("send-offer", { roomId }));
    }

    onOffer(roomId: string, sdp: string, senderSocketid: string) {
        const room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        const receivingUser = room.users.find(user => user.socket.id !== senderSocketid);
        receivingUser?.socket.emit("offer", {
            sdp,
            roomId
        })
    }
    
    onAnswer(roomId: string, sdp: string, senderSocketid: string) {
        const room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        const receivingUser = room.users.find(user => user.socket.id !== senderSocketid);
        receivingUser?.socket.emit("answer", {
            sdp,
            roomId
        });
    }

    onIceCandidates(roomId: string, senderSocketid: string, candidate: any, type: "sender" | "receiver") {
        const room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        const receivingUser = room.users.find(user => user.socket.id !== senderSocketid);
        receivingUser?.socket.emit("add-ice-candidate", ({candidate, type}));
    }

}