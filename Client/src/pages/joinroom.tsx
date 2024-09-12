import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useUserStore} from '../store'

const JoinRoom: React.FC = () => {
  const Navigate = useNavigate()
  const { username, roomID } = useUserStore();
  const [roomId,setRoomId] = useState<string>("")
  const [step, setStep] = useState(0);



  const [name, setName] = useState("");
  const [localAudioTrack, setLocalAudioTrack] = useState<MediaStreamTrack | null>(null);
  const [localVideoTrack, setlocalVideoTrack] = useState<MediaStreamTrack | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [joined, setJoined] = useState(false);
  const  { setLocalAudioTRACK } = useUserStore();
  const  { setLocalVideoTRACK } = useUserStore();


  const getCam = async () => {
    const stream = await window.navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    })
    // MediaStream
    const audioTrack = stream.getAudioTracks()[0]
    const videoTrack = stream.getVideoTracks()[0]
    setLocalAudioTrack(audioTrack);
    setlocalVideoTrack(videoTrack);
    setLocalAudioTRACK(audioTrack);
    setLocalVideoTRACK(videoTrack);
    
    if (!videoRef.current) {
        return;
    }
    videoRef.current.srcObject = new MediaStream([videoTrack])
    videoRef.current.play();
    // MediaStream
  }

  useEffect(() => {
      if (videoRef && videoRef.current) {
          getCam()
      }
  }, [videoRef]);



  useEffect(()=>{
    // if(username==''){
    //     Navigate("/auth")
    // }
    if(roomID!="") setRoomId(roomID)
  })
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setStep(1);
    event.preventDefault();
  };

  const joinRoom = () => {
    Navigate(`/room/${roomId}`)
  }

  return (
    <div>
      {step==0 && 

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
        <button onClick={()=>{Navigate("/create")}} className="text-blue-400 hover:text-blue-200 focus:outline-none">
          Create Room
        </button>
      </p>
    </div>}

    {step==1 && 
      <div>
        <video autoPlay ref={videoRef}></video>
        <input type="text" onChange={(e) => {
            setName(e.target.value);
        }}>
        </input>
        <button onClick={() => {
            setJoined(true);
            joinRoom();

        }}>Join</button>
      </div>
      
    }
    
    </div>
  );
};

export default JoinRoom;
