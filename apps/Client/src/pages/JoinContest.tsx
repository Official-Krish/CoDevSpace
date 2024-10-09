import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { ArrowRight, Clock, Globe, Users } from 'lucide-react';
import { ContestRoom } from './ContestRoom';
import Cookies from 'js-cookie';

const JoinContest = () => {
    const navigate = useNavigate();
    const {roomID} = useUserStore();
    const [roomId, setRoomId] = useState<string>(roomID);
    const [joined, setJoined ] = useState(false);

    useEffect(() => {
        if(!Cookies.get("token")){
          navigate("/Signin");
        }
      })

    useEffect(() => {
        if (roomID !== "") setRoomId(roomID);
    }, [roomID]);

    if(!joined){
  
        return (
            <div className='bg-gray-900 h-screen'>
                <div className='pt-28'>
                    <main className="flex-grow flex items-center justify-center p-4">
                        <div className="w-full max-w-4xl">
                            <Card className="bg-gray-900 text-gray-100 border-gray-800">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold text-center text-emerald-400">Join Contest</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="md:flex items-start space-y-6 md:space-y-0 md:space-x-6">
                                        <div className="md:w-1/2">
                                            <form onSubmit={() => {}} className="space-y-4">
                                                <div className="space-y-2">
                                                <Label htmlFor="room-id">Room ID</Label>
                                                <Input 
                                                    id="room-id" 
                                                    placeholder="Enter room ID" 
                                                    required 
                                                    value={roomId}
                                                    onChange={(e) => {setRoomId(e.target.value)
                                                    localStorage.setItem("roomId", e.target.value);
                                                    }}
                                                    className="bg-gray-800 border-gray-700 text-gray-100 focus:border-emerald-400 focus:ring-emerald-400" 
                                                />
                                                </div>
                                                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => {setJoined(true);}}>
                                                Join Room <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </form>
                                            <p className="mt-4 text-sm text-gray-400 text-center">
                                                Don't have a room ID? <div className="text-emerald-400 hover:underline cursor-pointer" onClick={() => navigate("/create")}>Create a new room</div>
                                            </p>
                                        </div>
                                        <div className="md:w-1/2 bg-gray-800 p-6 rounded-lg">
                                            <h3 className="text-lg font-semibold mb-4 text-emerald-400">What to expect:</h3>
                                            <ul className="space-y-3">
                                                <li className="flex items-start">
                                                    <Users className="h-5 w-5 mr-2 text-emerald-400 mt-0.5" />
                                                    <span>Collaborate with team members in real-time</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <Clock className="h-5 w-5 mr-2 text-emerald-400 mt-0.5" />
                                                    <span>Instant code synchronization across all participants</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <Globe className="h-5 w-5 mr-2 text-emerald-400 mt-0.5" />
                                                    <span>Access your coding session from anywhere in the world</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-center">
                                    <p className="text-sm text-gray-400 flex">
                                        By joining a room, you agree to our <button  className="text-emerald-400 hover:underline px-1 ">Terms of Service</button> and <button className="text-emerald-400 hover:underline px-1">Privacy Policy</button>
                                    </p>
                                </CardFooter>
                            </Card>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return <ContestRoom roomId={roomId} />;
};

export default JoinContest;
