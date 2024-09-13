import  { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store';
import {Room} from './room';

const JoinRoom = () => {
  const navigate = useNavigate();
  const {roomID} = useUserStore();
  const [roomId, setRoomId] = useState<string>(roomID);
  const [localAudioTrack, setLocalAudioTrack] = useState<MediaStreamTrack | null>(null);
  const [localVideoTrack, setLocalVideoTrack] = useState<MediaStreamTrack | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [joined, setJoined] = useState(false);

  const getCam = async () => {
      const stream = await window.navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
      })
      // MediaStream
      const audioTrack = stream.getAudioTracks()[0]
      const videoTrack = stream.getVideoTracks()[0]
      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);
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

  useEffect(() => {
    if (roomID !== "") setRoomId(roomID);
  }, [roomID]);
  
  if (!joined){
    return (
      <div className="min-h-screen bg-gray-900 text-blue-200 flex flex-col justify-center items-center">
            <h2 className="text-3xl mb-4">Join Room</h2>
            <div  className="flex flex-col items-center">
              <input
                type="text"
                placeholder="Room ID"
                className="bg-blue-900 text-blue-200 border-b border-blue-400 rounded mb-4 px-3 py-2"
                value={roomId}
                onChange={(e) => {setRoomId(e.target.value)
                  localStorage.setItem("roomId", e.target.value);
                }
                  
                }
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-blue-100 font-semibold px-4 py-2 rounded"
                onClick={() => {setJoined(true);}}
              >
                Join Room
              </button>
            </div>
            <p className="mt-4">
              Don't have a room?{' '}
              <button onClick={() => navigate("/create")} className="text-blue-400 hover:text-blue-200 focus:outline-none">
                Create Room
              </button>
            </p>
            <video autoPlay ref={videoRef}></video>
      </div>
    );
  }
  return <Room localAudioTrack={localAudioTrack} localVideoTrack={localVideoTrack} name={"Hai Kuch"} />
};

export default JoinRoom;
