import  { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../store';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { ArrowRight, Users } from 'lucide-react';
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
            <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center">
              <main className="container mx-auto px-4 py-8 flex flex-col items-center mt-20">
                <div className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-8">
                  <h1 className="text-3xl font-bold mb-4 text-center">Join a Contest</h1>
                  <p className="text-gray-400 mb-8 text-center">
                    Enter the contest ID provided by your friend or find a public contest to join and showcase your coding skills!
                  </p>
                  <form className="space-y-6">
                    <div>
                      <Label htmlFor="contest-id">Contest ID</Label>
                      <Input
                        id="contest-id"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Enter contest ID"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105" onClick={() => {setJoined(true);}}>
                      Join Contest
                    </Button>
                  </form>
                  <div className="mt-8 pt-6 border-t border-gray-700">
                    <h2 className="text-xl font-semibold mb-4">Don't have a contest ID?</h2>
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full bg-gray-700 text-white border-gray-600" onClick={() => navigate("/Contests")}>
                        <Users className="mr-2 h-4 w-4" />
                        Browse Public Contests
                      </Button>
                      <Link to="/createContest" className="block">
                        <Button variant="outline" className="w-full bg-gray-700 text-white border-gray-600">
                          <ArrowRight className="mr-2 h-4 w-4" />
                          Create Your Own Contest
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </main>
            </div>
        )
    }

    return <ContestRoom roomId={roomId} />;
};

export default JoinContest;
