"use client"
import { useUserStore } from '@/utils/store';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const JoinRoom = () => {
  const router = useRouter();
  const { username, roomID } = useUserStore();
  const [roomId,setRoomId] = useState<string>("")
  useEffect(()=>{
    if(roomID!="") setRoomId(roomID)
  })
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(`/room/${roomId}`)
  };

  return (
    <div className="min-h-screen bg-gray-900 text-blue-200 flex flex-col justify-center items-center">
      <h2 className="text-3xl mb-4">Join Room</h2>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="text"
          placeholder="Room ID"
          className="bg-blue-900 text-blue-200 border-b border-blue-400 rounded mb-4 px-3 py-2"
          value={roomId}
          onChange={(e)=>{setRoomId(e.target.value)}}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-blue-100 font-semibold px-4 py-2 rounded"
        >
          Join Room
        </button>
      </form>
      <p className="mt-4">
        Don't have a room?{' '}
        <button onClick={()=>{router.push("/create")}} className="text-blue-400 hover:text-blue-200 focus:outline-none">
          Create Room
        </button>
      </p>
    </div>
  );
};

export default JoinRoom;
