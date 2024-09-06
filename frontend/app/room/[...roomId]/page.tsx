"use client";

import { useUserStore } from '@/utils/store';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { typescriptLanguage } from '@codemirror/lang-javascript'; 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Mic, MicOff, Users, MessageSquare, Code2, ChevronDown } from 'lucide-react'


interface chat {
    username: string;
    message: string;
}

const Room = () => {


    const [isMicOn, setIsMicOn] = useState(false)
    const languages = ['JavaScript', 'Python', 'Java', 'C++', 'TypeScript']
    const [msg, setmsg] = useState("");

    const router = useRouter();
    const { roomId } = useParams();
    const { username } = useUserStore();
    const [ roomName, setRoomName ] = useState("");
    const [ users, setUsers ] = useState<string[]>([]);
    const [ chats, setChats ] = useState<chat[]>([]);
    const[ result, setResult ] = useState(null);
    const [ language, setLanguage ] = useState("Select Language");
    const [ code , setCode ] = useState("");
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [ submitClicked, setSubmitClicked ] = useState(false);

    useEffect(() => {
        const url = process.env.WS_URL || "";
        const newSocket = new WebSocket(url);

        newSocket.onopen = () => {
            console.log('WebSocket connected');

            const msg = {
                Title : "User-Joined",
                roomId,
                username
            }

            newSocket.send(JSON.stringify(msg));
        };

        newSocket.onmessage = (message) => {
            const parsedMessage = JSON.parse(message.data);
            console.log(parsedMessage);

            if (parsedMessage.Title === "Room-Info"){
                setUsers(parsedMessage.users);
                setCode(parsedMessage.code);
                setLanguage(parsedMessage.language);
                setRoomName(parsedMessage.roomName);
                setChats(parsedMessage.chats);
                setResult(parsedMessage.result);
            }
            else if (parsedMessage.Title === "Not-found"){
                router.push("/join");
            }
            else if (parsedMessage.Title === "New-User"){
                toast.success(`${parsedMessage.username} joined the room`);
                setUsers((prev) => [...prev, parsedMessage.username]);
            }
            else if(parsedMessage.Title === "User-Left"){
                toast.error(`${parsedMessage.username} left the room`);
                setUsers((prev) => prev.filter((user) => user !== parsedMessage.username));
            }

            else if (parsedMessage.Title === "New-chat"){
                const {username, chat} = parsedMessage;
                setChats((prev) => {
                    const newChat = { username, message: chat };
                    return [...prev, newChat];
                })
            }
            else if (parsedMessage.Title === "lang-change"){
                setLanguage(parsedMessage.language);
            }

            else if (parsedMessage.Title === "Code=change"){
                setCode(parsedMessage.code);
            }
            else if (parsedMessage.Title === "Submit-clicked"){
                setSubmitClicked(true);
            }
            else if(parsedMessage.Title === "Result"){
                setResult(parsedMessage);
                setSubmitClicked(false);
            }
            else if (parsedMessage.Title === "No-worker"){
                setSubmitClicked(false);
                alert("Code cannot be processed now cause it requires a continiously running worker service whcih is expensive 😅😅, if you want to, you can clone the repo and run worker process locally!!")
            }
        }
        setSocket(newSocket);
        return () => {
            newSocket.close();
        }
    }, [])

    const getLanguageExtension = (language: string) => {
        switch(language){
            case "Python":
                return python();
            case "Java":
                return java();
            case "C++":
                return cpp();
            case "JavaScript":
                return javascript({jsx : true});
            case "Typescript":
                return typescriptLanguage;
            default:
                return cpp();
        }
    }

    const onLeave = () => {
        const msg = {
            Title : "User-Left",
            roomId,
            username
        }
        socket?.send(JSON.stringify(msg));
        router.push("/join");
    }

    const handleCodeChange = (value: string) => {
        setCode(value);
        const msg = {
            Title : "Code-change",
            roomId,
            code : value
        }
        socket?.send(JSON.stringify(msg));
    }

    const handleLanguageChange = (value: string) => {
        setLanguage(value);
        const msg = {
            Title : "lang-change",
            roomId,
            language : value
        }
        socket?.send(JSON.stringify(msg));
    }

    const onSubmit = () => {
        const msg = {
            Title : "Submitted",
            roomId,
            code,
            language
        }
        socket?.send(JSON.stringify(msg));
    }

    function addChat(message : string){
        const msg = {
            Title : "New-chat",
            roomId,
            username,
            chat : message
        }
        socket?.send(JSON.stringify(msg));
    }


  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
        <div className="flex flex-1 overflow-hidden p-4 space-x-4">
            <div className="flex flex-col flex-1 bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                {/* Language Dropdown */}
                <div className="p-2 bg-gray-700 border-b border-gray-600 flex items-center justify-between">
                    <Code2 className="h-5 w-5 mr-2 text-purple-400" />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-[180px] justify-between bg-gray-800 text-white border-gray-600">
                                {language}
                                <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[180px] bg-gray-800 border-gray-600">
                            {languages.map((lang) => (
                            <DropdownMenuItem
                                key={lang}
                                onSelect={() => {
                                    setLanguage(lang)
                                    handleLanguageChange(lang)
                                }}
                                className="text-white hover:bg-gray-700"
                            >
                                {lang}
                            </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className='flex justify-end px-3 py-1 rounded-md bg-green-700 text-white hover:bg-green-600 cursor-pointer'>
                        <button onClick={() => {
                            onSubmit()
                            }}>
                            Submit
                        </button>
                    </div>
                </div>

                {/* Code Editor */}
          <div className='flex-1'>
                <CodeMirror
                    value={code} 
                    onChange={(val)=>{handleCodeChange(val)}}
                    height="100%"
                    width="100%"
                    theme="dark"
                    extensions={[getLanguageExtension(language)]}
                />
            </div>

          {/* Output Box */}
          <div className="h-1/3 p-4 bg-gray-700 border-t-2 border-gray-600">
            <h2 className="text-lg font-semibold mb-2 text-purple-300">Output</h2>
            <Textarea
              className="w-full h-[calc(100%-2rem)] resize-none font-mono bg-gray-800 text-gray-100 border-2 border-gray-600 rounded-md"
              readOnly
              placeholder="Output will appear here..."
              value={result ? result : ""}
            />
          </div>
        </div>

        <div className="w-80 flex flex-col bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          {/* Participants */}
          <div className="p-4 bg-gradient-to-r from-gray-800 to-indigo-900">
            <h2 className="text-lg font-semibold mb-2 flex items-center text-purple-300">
              <Users className="h-5 w-5 mr-2" />
              Participants
            </h2>
            <ul className="space-y-1">
              {users.map((participant, index) => (
                <li key={index} className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                  {participant}
                </li>
              ))}
            </ul>
          </div>

          {/* Chat */}
          <div className="flex-1 flex flex-col p-4 overflow-hidden">
            <h2 className="text-lg font-semibold mb-2 flex items-center text-purple-300">
              <MessageSquare className="h-5 w-5 mr-2" />
                Chat
            </h2>
            <div className="flex-1 overflow-y-auto mb-4 space-y-2">
              {chats.map((msg, index) => (
                <div key={index} className="p-2 bg-gray-700 rounded-lg">
                  <span className="font-semibold text-purple-400">{msg.username}: </span>
                  <span>{msg.message}</span>
                </div>
              ))}
            </div>
            <div className="flex">
              <Input 
                className="flex-1 mr-2 bg-gray-700 border-gray-600 text-white focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50" 
                placeholder="Type a message..." 

                onChange={(e) => setmsg(e.target.value)}
              />
              <Button onClick={() => {
                    {msg === "" ? null : addChat(msg)}
                    setmsg("");
                }
                } className="bg-purple-600 hover:bg-purple-700">Send</Button>
            </div>
          </div>

          {/* Mic Toggle */}
          <div className="p-4 bg-gradient-to-r from-gray-800 to-indigo-900">
            <Button
              variant={isMicOn ? "default" : "outline"}
              className={`w-full ${isMicOn ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white`}
              onClick={() => setIsMicOn(!isMicOn)}
            >
              {isMicOn ? (
                <Mic className="h-4 w-4 mr-2" />
              ) : (
                <MicOff className="h-4 w-4 mr-2" />
              )}
              {isMicOn ? "Mic On" : "Mic Off"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Room;