import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {useUserStore} from '../store'
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';

import toast from 'react-hot-toast';
import { Button } from '../components/ui/button'; 
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea'; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Mic, MicOff, Users, MessageSquare, Code2, ChevronDown } from 'lucide-react'


type chat = 
  {
    username:string,
    message:string
  }

const Room: React.FC = () => {
  const Navigate = useNavigate()
  const [isMicOn, setIsMicOn] = useState(false)
  const languages = ['JavaScript', 'Python', 'Java', 'C++', 'TypeScript']
  const [msg, setmsg] = useState("");

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
  const { setRoomID } = useUserStore();

  //fire socket events on lang change, chat , code change, new user is done, add button leave user and copy room id

  useEffect(()=>{
    let ws_url = "ws://localhost:3000"
    console.log(ws_url);
    const newSocket = new WebSocket(ws_url);
    newSocket.onopen = () => {
      console.log('Connection established');
      const msg = {
        Title : "User-joined",
        roomId,
        username
      }
      newSocket.send(JSON.stringify(msg))
    }
    newSocket.onmessage = (message) => {
      const parsedMessage = JSON.parse(message.data);
      console.log('Message received:', parsedMessage);
      if (parsedMessage.Title === "Room-Info") {
        setUsers(parsedMessage.users);
        setCode(parsedMessage.code);
        setLanguage(parsedMessage.language);
        setResult(parsedMessage.result);
        setChats(parsedMessage.chats);
        setRoomName(parsedMessage.roomName)
      } 
      else if(parsedMessage.Title === "Not-found"){
        alert("No room found")
        Navigate("/join")
      }
      else if (parsedMessage.Title === "New-User") {
        toast.success(`${parsedMessage.username} joined` )
        setUsers(prevUsers => [...prevUsers, parsedMessage.username]);
      }
      else if(parsedMessage.Title === "User-left"){
        toast.error(`${parsedMessage.username} left`)
        setUsers(parsedMessage.users)
      }
      else if(parsedMessage.Title === "New-chat"){
        const {username, chat} = parsedMessage
        setChats((prevChats) => {
          // Create a new chat object
          const newChat = { username, message:chat };
  
          // Return the updated chats array
          return [...prevChats, newChat];
        });
      }
      else if(parsedMessage.Title === "lang-change"){
        const { lang } = parsedMessage
        setLanguage(lang)
      }
      else if(parsedMessage.Title === "Code-change"){
        const { code } = parsedMessage
        setCode(code)
      }
      else if(parsedMessage.Title === "Submit-clicked"){
        setSubmitClicked(true);
      }
      else if(parsedMessage.Title === "Result"){
        setResult(parsedMessage)
        setSubmitClicked(false)
      }
      else if(parsedMessage.Title === "No-worker"){
        setSubmitClicked(false)
        alert("Code cannot be processed now cause it requires a continiously running worker service whcih is expensive 😅😅, if you want to, you can clone the repo and run worker process locally!!")
      }
    }
    setSocket(newSocket)
    return () => newSocket.close();
  },[])




  const getLanguageExtension = (lang:string) => {
    switch (lang) {
      case 'javascript':
        return javascript({ jsx: true });
      case 'java':
        return java();
      case 'cpp':
        return cpp();
      case 'python':
        return python();
      default:
        return javascript({ jsx: true });
    }
  };

  const onLeave = () => {
    //fire websocket event
    const msg = {
      Title : "User-left",
      roomId,
      username
    }
    socket?.send(JSON.stringify(msg))
    setRoomID("")
    Navigate("/join")
  }

  const handleCodeChange = (val:string) => {
    //fire websocket event
    const msg = {
      Title: "Code-change",
      roomId,
      code:val
    }
    socket?.send(JSON.stringify(msg))
    setCode(val)
  }

  const handleLangChange = (val:string) => {
    //fire websocket event
    const msg = {
      Title: "lang-change",
      roomId,
      lang:val
    }
    socket?.send(JSON.stringify(msg))
  }

  const onSubmit = () => {
    console.log(code)
    //make a ws req to server, send the code there, subscribe to the roomid on pub-sub
    const msg = {
      Title : "Submitted",
      roomId,
      language,
      code
    }
    socket?.send(JSON.stringify(msg))
  }

  function addChat(message:string){
    //fire websocket event
    const msg = {
      Title : "New-chat",
      roomId,
      username,
      chat:message
    }
    socket?.send(JSON.stringify(msg))
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
                                      handleLangChange(lang)
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
  );
}

export default Room