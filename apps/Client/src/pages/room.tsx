import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { Users, MessageSquare, Code2, ChevronDown, MicIcon, MicOffIcon, Video, VideoOff, Info, LogOut, Copy, LinkIcon, EllipsisVertical } from 'lucide-react'

import { Socket, io } from "socket.io-client";
import { BACKEND_URL, WEB_SOCKET_URL } from "../../config";
import Draggable from 'react-draggable';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '../components/ui/drawer';
import axios from 'axios';
import { htmlToText } from 'html-to-text';
import { RoomDropDown } from '../components/CodeSnippet';


type chat = 
  {
    username:string,
    message:string
  }

export const Room = ({ localAudioTrack, localVideoTrack, name } : {
  localAudioTrack: MediaStreamTrack | null;
  localVideoTrack: MediaStreamTrack | null;
  name: string;
}) => {
  window.history.pushState(null, '', '/room');
  const Navigate = useNavigate();
  const languages = ['JavaScript', 'Python', 'Java', 'C++', 'TypeScript']
  const [msg, setmsg] = useState("");

  const roomId  = localStorage.getItem("roomId") || "";
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
  const [qustnAdd, setQustnAdd] = useState(false);
  const [leetCodeLink, setLeetCodeLink] = useState("");
  const [ qustnAdded, setQustnAdded ] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);


  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast.success('Room ID copied to clipboard');
  }

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
        setResult(parsedMessage.stdout)
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
    localStorage.setItem("roomId", "");
    Navigate("/join");
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




  // WEBRTC

  const [lobby, setLobby] = useState<boolean>(true);
  const [socket2, setSocket2] = useState<Socket | null>(null);
  const [sendingPc, setSendingPc] = useState<RTCPeerConnection | null>(null);
  const [receivingPc, setReceivingPc] = useState<RTCPeerConnection | null>(null);
  const [remoteVideoTrack, setRemoteVideoTrack] = useState<MediaStreamTrack | null>(null);
  const [remoteAudioTrack, setRemoteAudioTrack] = useState<MediaStreamTrack | null>(null);
  const [remoteMediaStream, setRemoteMediaStream] = useState<MediaStream | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);


  useEffect(() => {
      const RTCsocket = io(WEB_SOCKET_URL);
      setSocket2(socket2);

      RTCsocket.on("connect", () => {
        const name = localStorage.getItem("name");
        const id = roomId;      
        RTCsocket.emit("userDetails", { name, id });
      });

      RTCsocket.on('send-offer', async ({ roomId }: { roomId: string }) => {
          console.log("sending offer");
          setLobby(false);
          const pc = new RTCPeerConnection();
          setSendingPc(pc);

          if (localVideoTrack) {
              pc.addTrack(localVideoTrack);
          }
          if (localAudioTrack) {
              pc.addTrack(localAudioTrack);
          }

          pc.onicecandidate = (e) => {
              if (e.candidate) {
                  RTCsocket.emit("add-ice-candidate", {
                      candidate: e.candidate,
                      type: "sender",
                      roomId
                  });
              }
          };

          pc.onnegotiationneeded = async () => {
              const sdp = await pc.createOffer();
              pc.setLocalDescription(sdp);
              RTCsocket.emit("offer", {
                  sdp,
                  roomId
              });
          };
      });

      RTCsocket.on("offer", async ({ roomId, sdp: remoteSdp }: { roomId: string; sdp: RTCSessionDescriptionInit }) => {
          console.log("received offer");
          setLobby(false);
          const pc = new RTCPeerConnection();
          pc.setRemoteDescription(remoteSdp);
          const sdp = await pc.createAnswer();
          pc.setLocalDescription(sdp);

          const stream = new MediaStream();
          if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = stream;
          }

          setRemoteMediaStream(stream);
          setReceivingPc(pc);

          pc.ontrack = (e) => {
              alert("ontrack");
          }

          pc.onicecandidate = (e) => {
              if (e.candidate) {
                  RTCsocket.emit("add-ice-candidate", {
                      candidate: e.candidate,
                      type: "receiver",
                      roomId
                  });
              }
          };

          RTCsocket.emit("answer", {
              roomId,
              sdp: sdp
          });
          setTimeout(() => {
              const track1 = pc.getTransceivers()[0].receiver.track
              const track2 = pc.getTransceivers()[1].receiver.track
              console.log(track1);
              if (track1.kind === "video") {
                  setRemoteAudioTrack(track2)
                  setRemoteVideoTrack(track1)
              } else {
                  setRemoteAudioTrack(track1)
                  setRemoteVideoTrack(track2)
              }
              //@ts-ignore
              remoteVideoRef.current.srcObject.addTrack(track1)
              //@ts-ignore
              remoteVideoRef.current.srcObject.addTrack(track2)
              //@ts-ignore
              remoteVideoRef.current.play();
          }, 5000)
      });

      

      RTCsocket.on("answer", ({ roomId, sdp: remoteSdp }: { roomId: string; sdp: RTCSessionDescriptionInit }) => {
          setLobby(false);
          setSendingPc(pc => {
              if (pc) {
                  pc.setRemoteDescription(remoteSdp);
              }
              return pc;
          });
      });

      RTCsocket.on("lobby", () => {
          setLobby(true);
      });

      RTCsocket.on("add-ice-candidate", ({candidate, type}) => {
          console.log("add ice candidate from remote");
          console.log({candidate, type})
          if (type == "sender") {
              setReceivingPc(pc => {
                  if (!pc) {
                      console.error("receicng pc nout found")
                  } else {
                      console.error(pc.ontrack)
                  }
                  pc?.addIceCandidate(candidate)
                  return pc;
              });
          } else {
              setSendingPc(pc => {
                  if (!pc) {
                      console.error("sending pc nout found")
                  } else {
                      // console.error(pc.ontrack)
                  }
                  pc?.addIceCandidate(candidate)
                  return pc;
              });
          }
      })

      setSocket2(socket2);
  }, [name])

  useEffect(() => {
      if (localVideoRef.current && localVideoTrack) {
          const stream = new MediaStream([localVideoTrack]);
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play();
      }
  }, [localVideoTrack]);

  
  useEffect(() => {
      if (localAudioTrack) {
          localAudioTrack.enabled = micEnabled;
      }
  }, [micEnabled]);

  useEffect(() => {
      if (localVideoTrack) {
          localVideoTrack.enabled = cameraEnabled;
      }
  }, [cameraEnabled]);



  {/* Get Question */}
  const [problem, setProblem] = useState<any>(null);

  const handleFetchProblem = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/getQustn`,{
        params:{
          slug: leetCodeLink.split("/problems/")[1].split("/")[0]
        }
      });
      const problemData = response.data;

      // Check if content exists and is a string
      const cleanedContent = problemData.content
        ? htmlToText(problemData.content, {
            wordwrap: 130,
            preserveNewlines: true,
          })
        : '';

      setProblem({
        ...problemData,
        content: cleanedContent,
      });
    } catch (err) {
      console.error('Error fetching problem:', err);
    }
  };

  const formatExamples = (content: string | undefined) => {
    if (!content || typeof content !== 'string') return { description: '', examples: '', constraints: '' };

    const exampleStartIndex = content.indexOf('Example');
    const constraintStartIndex = content.indexOf('Constraints');

    const description = exampleStartIndex !== -1 ? content.slice(0, exampleStartIndex).trim() : content;
    const examples = (exampleStartIndex !== -1 && constraintStartIndex !== -1)
        ? content.slice(exampleStartIndex, constraintStartIndex).trim()
        : '';
    let constraints = constraintStartIndex !== -1 ? content.slice(constraintStartIndex).trim() : '';

    return { description, examples, constraints };
  };

  const formatConstraints = (constraints: string) => {
    return constraints
    .replace(/^Constraints:\s*/i, '')
    .replace(/•\s*/g, '• ')         // Ensure space after bullet points
    .replace(/\n\s*\n/g, '\n\n')    // Collapse multiple newlines into two
    .trim();                        // Remove leading/trailing whitespace
  };


  return (
    <div className='bg-gray-900'>
      <div className="flex h-screen bg-gray-900 text-gray-100">
        <div className="flex flex-1 overflow-hidden p-4 space-x-4 w-1/2">
          <div className="flex flex-col flex-1 bg-gray-900 rounded-lg shadow-xl overflow-hidden ">
            {/* Language Dropdown */}
            <div className="p-2 bg-gray-800 border-b border-gray-600 flex items-center justify-between">
              <Code2 className="h-5 w-5 mr-2 text-emerald-400" />
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
              
              {qustnAdd && <Button className='bg-emerald-600 hover:bg-emerald-700' onClick={() => {setQustnAdd(false)
                  setQustnAdded(false)
                }}> 
                Show Chat 
                </Button>
              }
              {!qustnAdd && 
                <Button onClick={() => setQustnAdd(true)} className="bg-emerald-600 hover:bg-emerald-700">
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Load Question
                </Button>
              }


              <Button className=' bg-green-700 text-white hover:bg-green-600' onClick={() => {
                onSubmit()
                }}>
                Submit
              </Button>

              <div>
                <RoomDropDown reff={editorRef}/>
              </div>
            </div>

            {/* Code Editor */}
            <div className='flex-1 bg-gray-800 overflow-scroll' ref={editorRef}>
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
          <div className="h-1/3 p-4 bg-gray-800 border-t-2 border-gray-700">
            <h2 className="text-lg font-semibold mb-2 text-purple-300">Output</h2>
            <Textarea
              className="w-full h-[calc(100%-2rem)] resize-none font-mono bg-gray-900 text-gray-100 border-2 border-gray-600 rounded-md"
              readOnly
              placeholder="Output will appear here..."
              value={result ? result : ""}
            />
          </div>
        </div>
        {!qustnAdd && 
        
          <div className="flex flex-col bg-gray-900 rounded-lg shadow-xl overflow-hidden">
            {/* Participants */}
            <div className="p-4 bg-gradient-to-r from-gray-800 to-indigo-900">
              <div className='flex justify-between items-center'>
                <h2 className="text-lg font-semibold mb-2 flex items-center text-purple-300">
                  <Users className="h-5 w-5 mr-2" />
                  Participants
                </h2>
                <div>
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Info className="h-4 w-4 text-black" />
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>Room Information</DrawerTitle>
                        <DrawerDescription>Details about the current coding session</DrawerDescription>
                      </DrawerHeader>
                      <div className="p-4 space-y-4">
                        <div>
                          <h3 className="font-semibold">Room Name</h3>
                          <p>{roomName}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold">Room ID</h3>
                          <div className='flex'>
                            <p>{roomId}</p>
                            <button onClick={copyRoomId} className="ml-2 bg-white text-black hover:bg-slate-100">
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold">Current Language</h3>
                          <p>{language}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold">Participants</h3>
                          <p>{users.length} user(s) in the room</p>
                        </div>
                        <Button onClick={onLeave} className="w-full bg-red-600 hover:bg-red-700">
                          <LogOut className="h-4 w-4 mr-2" />
                          Leave Room
                        </Button>
                      </div>
                    </DrawerContent>
                  </Drawer>
                </div>
              </div>
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
                  value={msg}
                  onChange={(e) => setmsg(e.target.value)}
                />
                <Button onClick={() => {
                    addChat(msg)
                    setmsg("");
                  }} 
                  className="bg-purple-600 hover:bg-purple-700">
                    Send
                </Button>
              </div>
            </div>

            {/* Mic Toggle */}
            <div className="p-4 flex justify-between border-t border-gray-700">
              <Button className="bg-gray-900 text-white hover:bg-gray-700">
                {cameraEnabled ? <Video className="h-5 w-5" onClick={() => setCameraEnabled(false)}/> : <VideoOff className="h-5 w-5" onClick={() => setCameraEnabled(true)}/>}
              </Button>
              <Button className="bg-gray-900 text-white hover:bg-gray-700">
                {micEnabled ? <MicIcon className="h-5 w-5" onClick={() => setMicEnabled(false)}/> : <MicOffIcon className="h-5 w-5" onClick={() => setMicEnabled(true)}/>}
              </Button>
              <Button onClick={onLeave} className="bg-red-600 hover:bg-red-700 flex items-center justify-center"> 
                Leave
              </Button>
            </div>
          </div>
        }

        {/* Load Question}*/}
        {qustnAdd && !qustnAdded &&
          <div className="mb-4 flex justify-center items-center">
            <Input
              value={leetCodeLink}
              onChange={(e) => setLeetCodeLink(e.target.value)}
              placeholder="Paste LeetCode link here"
              className="flex-grow mr-2 bg-gray-800 border-gray-700 text-gray-100 focus:border-emerald-400 focus:ring-emerald-400"
            />
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => {
                setQustnAdded(true)
                handleFetchProblem()
              }}>
              <LinkIcon className="h-4 w-4 mr-2" />
              Load Question
            </Button>
          </div>
        }

        {/* Question Box */}
        {
          qustnAdded && 
            <div className="flex flex-col bg-gray-900 rounded-lg shadow-xl overflow-hidden w-4/12">
              {problem && (
                <div className="mt-5 border overflow-scroll p-4 border-gray-800">
                  <h2 className="text-3xl font-bold mb-3 underline">{problem.title}</h2>

                {problem.content && (
                  <div className="mb-4">
                    {/* Extract sections from content */}
                    {(() => {
                      const { description, examples, constraints } = formatExamples(problem.content);

                      return (
                        <>
                          {/* Description */}
                          <div>
                            <p className="">{description}</p>
                          </div>

                          {/* Examples */}
                          <div className="mt-4">
                            <div className='underline text-2xl font-semibold pb-4'>Examples</div>
                            <p className="whitespace-pre-line leading-normal">{formatConstraints(examples)}</p>
                          </div>

                          {/* Constraints */}
                          <div className="mt-4">
                            <div className='underline text-2xl font-semibold pb-4'>Constraints</div>
                            <p className="whitespace-pre-line leading-normal font-medium">{formatConstraints(constraints)}</p> {/* Added leading-relaxed for more space */}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}

                <div className='flex'>
                  <h3 className="text-md font-bold underline pr-1.5">Difficulty:</h3>
                  <div>{problem.difficulty}</div>
                </div>
              </div>
            )}
          </div>
        }


        <Draggable>
          <div
            style={{
              width: '200px',
              height: '150px',
              backgroundColor: 'black', // You can style the container for your video
              border: '1px solid #ccc',
              position: 'absolute',
              zIndex: 1000,
            }}
            className='flex'
          >
            <video autoPlay width={400} height={100} ref={localVideoRef} />
            
            <video autoPlay width={400} height={100} ref={remoteVideoRef} /> 
          </div>
        </Draggable>
      </div>
        
    </div>
          
    </div>
  );
}
export default Room;
