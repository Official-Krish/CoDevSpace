import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { Copy, Globe, Users } from 'lucide-react';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import axios from 'axios';
import { BACKEND_URL } from '../../config';
import { useUserStore } from '../store';
import Cookies from 'js-cookie';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';

export default function CreateContest() {
  const [roomName, setRoomName] = useState('');
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();
  const [problemId, setProblemId] = useState('');
  const [problems, setProblems] = useState<any[]>([]);
  const { setRoomID } = useUserStore();
  const [participants, setParticipants] = useState(2)
  const [friends, setFriends] = useState(true)

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    alert('Room ID copied to clipboard');
  };

  const handleGenerateRoomId = () => {
    const newRoomId = uuidv4();
    setRoomId(newRoomId);
  };

  const handleSubmit = async () => {
    console.log("roomName", roomName);
    console.log("roomId", roomId);
    console.log("problemId", problemId);

    if (!roomId || !roomName || !problemId) {
      alert("Please fill in all fields");
      return;
    }

    let url = "http://localhost:3000";
    try {
      const response = await axios.post(`${url}/api/createContest`, {
        username: localStorage.getItem("name"),
        roomName : roomName,
        roomId:roomId,
        problemId : problemId,
        participantCount : participants,
        friends : friends
      });
      if (response.status === 200) {
        setRoomID(roomId)
        localStorage.setItem("roomId", roomId);
        navigate("/joinContest");
      } else {
        alert("Error creating room");
      }
    } catch (err) {
      console.error(err);
    }
  };

  
  
  useEffect(() => {
    async function fetchProblems() {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/problem/getProblems`);
        setProblems(response.data);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    }
    fetchProblems();
  }, []);

  useEffect(() => {
    if(!Cookies.get("token")){
      navigate("/Signin");
    }
  })

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center">
      <main className="container mx-auto px-4 py-8 flex flex-col items-center mt-4">
        <div className="w-full max-w-2xl bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-4 text-center">Create a New Contest</h1>
          <p className="text-gray-400 mb-8 text-center max-w-2xl">
            Set up your coding challenge and invite friends or compete with coders worldwide. 
            Customize your contest settings below to create the perfect coding showdown!
          </p>
          <div className="space-y-6">
            <div>
              <Label htmlFor="contest-name">Contest Name</Label>
              <Input
                id="contest-name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Enter contest name"
                required
              />
            </div>
            <div>
              <Label>Contest ID</Label>
              <div className='flex'>
                <div className="bg-gray-800 border border-gray-700 rounded-md p-2 font-mono text-teal-400 min-w-[565px]">
                  {roomId}
                </div>
                <Button onClick={copyRoomId} className="ml-2 bg-gray-700 hover:bg-gray-600" size="icon">
                  <Copy className="h-5 w-5" />
                  <span className="sr-only">Copy room ID</span>
                </Button>
              </div>
            </div>

            {(roomName && roomId) && 
              <div className="space-y-2">
                <Label htmlFor="problem-select">Select Problem</Label>
                <Select onValueChange={setProblemId}>
                  <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-gray-100">
                    <SelectValue placeholder="Select a problem" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
                    {problems.map((problem) => (
                      <SelectItem key={problem.id} value={problem.id}>
                        {problem.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            }

            <div>
              <Label>Number of Participants</Label>
              <div className="flex justify-between mt-2">
                {[2, 3, 4, 5].map((num) => (
                  <Button
                    key={num}
                    type="button"
                    variant={participants === num ? "default" : "outline"}
                    onClick={() => setParticipants(num)}
                    className={`w-14 h-14 ${participants === num ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-700'}`}
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>  
            <div>
              <Label>Challenge Type</Label>
              <RadioGroup value={friends === true ? "friends" : "world"} onValueChange={() => { setFriends(!friends) }} className="flex space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="friends" id="friends" className='text-white'/>
                  <Label htmlFor="friends" className="flex items-center space-x-2 cursor-pointer">
                    <Users className="h-5 w-5 text-blue-400" />
                    <span>Challenge Friends</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="world" id="world" className='text-white'/>
                  <Label htmlFor="world" className="flex items-center space-x-2 cursor-pointer">
                    <Globe className="h-5 w-5 text-teal-400" />
                    <span>Challenge World</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            {roomId === "" ? (
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold px-6 py-6 rounded-full transition-all duration-300 transform hover:scale-105" onClick={() => {
                handleGenerateRoomId();
                }}>
                Genrate Contest ID
              </Button>)
              : (
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold px-6 py-6 rounded-full transition-all duration-300 transform hover:scale-105" onClick={() => handleSubmit()}>
                  Create Contest
                </Button>
              )
            }
          </div>
        </div>
      </main>
    </div>
  )
}
