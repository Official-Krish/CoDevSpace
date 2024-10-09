import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { Copy, Globe, Lock, Users } from 'lucide-react';
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

export default function CreateContest() {
  const [roomName, setRoomName] = useState('');
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();
  const [problemId, setProblemId] = useState('');
  const [problems, setProblems] = useState<any[]>([]);
  const { setRoomID } = useUserStore();

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    alert('Room ID copied to clipboard');
  };

  const handleGenerateRoomId = () => {
    const newRoomId = uuidv4();
    setRoomId(newRoomId);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("roomName", roomName);
    console.log("roomId", roomId);
    console.log("problemId", problemId);

    if (!roomId || !roomName || !problemId) {
      alert("Please fill in all fields");
      return;
    }

    let url = "http://localhost:3000";
    try {
      const response = await fetch(`${url}/api/createContest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: localStorage.getItem("name"),
          roomName,
          roomId,
          problemId
        })
      });
      if (response.ok) {
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
    <div className="bg-gray-950 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-gray-900 text-gray-100 rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 bg-gray-800 p-8 flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-emerald-400 mb-4">Create a New Contest</h1>
            <p className="text-gray-400 mb-6">Challenge Your Friend</p>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-300">
                <Users className="h-5 w-5 mr-2 text-emerald-400" />
                Invite team members
              </li>
              <li className="flex items-center text-gray-300">
                <Lock className="h-5 w-5 mr-2 text-emerald-400" />
                Secure, private rooms
              </li>
              <li className="flex items-center text-gray-300">
                <Globe className="h-5 w-5 mr-2 text-emerald-400" />
                Code from anywhere
              </li>
            </ul>
          </div>
          <div className="md:w-1/2 p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="room-name">Room Name</Label>
                <Input
                  id="room-name"
                  placeholder="My Awesome Project"
                  required
                  type="text"
                  className="bg-gray-800 border-gray-700 text-gray-100 focus:border-emerald-400 focus:ring-emerald-400"
                  onChange={(e) => setRoomName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room-id">Room ID</Label>
                <div className='flex'>
                  <Input
                    id="room-id"
                    placeholder="Generate new room Id"
                    required
                    readOnly
                    className="bg-gray-800 border-gray-700 text-gray-100 focus:border-emerald-400 focus:ring-emerald-400"
                    value={roomId}
                  />
                  <Button onClick={copyRoomId} className="ml-2 bg-gray-700 hover:bg-gray-600" size="icon">
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy room ID</span>
                  </Button>
                </div>
              </div>
              {(roomName && roomId) && 
                <div className="space-y-2">
                  <Label htmlFor="problem-select">Select Problem</Label>
                  <Select onValueChange={setProblemId}>
                    <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-gray-100 focus:border-emerald-400 focus:ring-emerald-400">
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
              
              {roomId === "" ? (
                <Button
                  type="button"
                  onClick={handleGenerateRoomId}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Generate Room ID
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Create Room
                </Button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
