"use client"
import { useUserStore } from "@/utils/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

const CreateRomm = () => {
    const router = useRouter();
    const [rooomId, setRoomId] = useState("");
    const [roomName, setRoomName] = useState("");
    const { setRoomID } = useUserStore();


    const GenerateRoomId = () => {
        const newRommId = uuidv4();
        setRoomId(newRommId);
    }

    const handleSubmit = async () => {
        console.log("Room Name: ", roomName);
        console.log("Room ID: ", rooomId);

        const SERVER_URL = process.env.SERVER_URL;

        try{
            const resposne = await fetch(`http://localhost:3000/api/create`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    roomName: roomName,
                    roomId: rooomId,
                    username : "admin"
                })
            });

            if(resposne.ok){
                setRoomID(rooomId);
                router.push(`/room/${rooomId}`);
            }
        }catch(err){
            console.log(err);
        }
    }

    return <div className="flex flex-col items-center justify-center h-screen bg-black">
        <h1 className="text-2xl font-bold text-white">Create a Room</h1>
        <input type="text" className="border-2 border-gray-500 p-2 mt-4" placeholder="Enter Room Name" onChange={(e) => setRoomName(e.target.value)}/>
        <div className="flex flex-col items-center space-y-4 mt-4">
            <button onClick={GenerateRoomId} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Generate Room ID
            </button>
            <div className="text-2xl font-bold text-white">{rooomId}</div>
        </div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={handleSubmit}>
            Create Room
        </button>
    </div>
}

export default CreateRomm;