import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import {useUserStore} from '../store'
import { Copy, Globe, Lock, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Switch } from '../components/ui/switch';
import { Button } from '../components/ui/button';
import Cookies from 'js-cookie';
import { BACKEND_URL } from '../../config';
import axios from 'axios';


const CreateRoom: React.FC = () => {
  const [roomName, setRoomName] = useState('');
  const [roomId, setRoomId] = useState('');
  const Navigate = useNavigate()
  const { setRoomID } = useUserStore();
  const [isPrivate, setIsPrivate] = useState(false)
  const navigate = useNavigate();



  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    alert('Room ID copied to clipboard');
  }

  const handleGenerateRoomId = () => {
    const newRoomId = uuidv4();
    setRoomId(newRoomId);
  };

  const handleSubmit = async() => {
    console.log("Submit clicked!")
    if(!roomId || !roomName){
        alert("Fill name and id")
        return;
    }
    try{
      const response = await axios.post(`${BACKEND_URL}/api/create`,{
        username : localStorage.getItem("name"),
        roomName,
        roomId,
      }, {
        withCredentials : true,
      })
      if(response.status === 200){
        setRoomID(roomId)
        localStorage.setItem("roomId", roomId);
        Navigate("/join")
      }
      else{
        alert("Error creating room")
      }
    }
    catch(err){
      console.log(err)
    }
  };

  useEffect(() => {
    if(!Cookies.get("token")){
      navigate("/Signin");
    }
  })


  return ( 
    <div className='bg-gray-950'>
      <main className="flex-grow flex items-center justify-center p-4 bg-gray-900 min-h-screen">
        <div className="w-full max-w-4xl bg-gray-900 text-gray-100 rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 bg-gray-800 p-8 flex flex-col justify-center">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400 mb-4">Create a New Room</h1>
              <p className="text-gray-400 mb-6">Set up your collaborative coding environment in just a few steps.</p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-300">
                  <Users className="h-5 w-5 mr-3 text-blue-400" />
                  Invite team members
                </li>
                <li className="flex items-center text-gray-300">
                  <Lock className="h-5 w-5 mr-3 text-blue-400" />
                  Secure, private rooms
                </li>
                <li className="flex items-center text-gray-300">
                  <Globe className="h-5 w-5 mr-3 text-blue-400" />
                  Code from anywhere
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 p-8">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic Setup</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="room-name">Room Name</Label>
                    <Input id="room-name" placeholder="My Awesome Project" required type="text" className="bg-gray-800 border-gray-700 text-gray-100 focus:border-emerald-400 focus:ring-emerald-400" onChange={(e) => setRoomName(e.target.value)}/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="Room ID">Room ID</Label>
                    <div className='flex'>
                      <Input id="room-name" placeholder="Generate new room Id" required type="readonly" className="bg-gray-800 border-gray-700 text-gray-100 focus:border-emerald-400 focus:ring-emerald-400" value={roomId}/>
                      <Button onClick={copyRoomId} className="ml-2 bg-gray-700 hover:bg-gray-600" size="icon">
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy room ID</span>
                      </Button>
                    </div>
                    
                  </div>
                </TabsContent>
                <TabsContent value="advanced" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="private-room" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Private Room
                    </Label>
                    <Switch
                      id="private-room"
                      checked={isPrivate}
                      onCheckedChange={setIsPrivate}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Room ID</Label>
                    <div className="flex">
                      <Input value={roomId} readOnly className="flex-grow bg-gray-800 border-gray-700 text-gray-100 focus:border-emerald-400 focus:ring-emerald-400" />
                      <Button onClick={copyRoomId} className="ml-2 bg-gray-700 hover:bg-gray-600" size="icon">
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy room ID</span>
                      </Button>
                    </div>
                    <p className="text-xs text-gray-400">Share this ID with others to invite them to your room</p>
                  </div>
                </TabsContent>
              </Tabs>
              {roomId === "" ? 
                <Button
                  type="button"
                  onClick={handleGenerateRoomId}
                  className="w-full mt-6 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white"
                >
                  Generate Room ID
                </Button>
              :
                <Button
                  type="button"
                  onClick={() => handleSubmit()}
                  className="w-full mt-6 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white"
                >
                  Create Room
                </Button>
              }
              
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateRoom;
