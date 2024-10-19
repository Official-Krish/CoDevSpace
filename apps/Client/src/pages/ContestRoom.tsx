import { ProblemStatement } from "../components/ProblemStatement";
import SubmitBar from "../components/ProblemSubmitBar";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { AlertTriangle, Loader2, Trophy, Users } from "lucide-react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom"


export const ContestRoom = ({ roomId }: { roomId: string }) => {
    window.history.pushState(null, '', '/contest?id=' + roomId);

    const navigate = useNavigate();

    const [users, setUsers] = useState<string[]>([]);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [problemId, setProblemId] = useState('');
    const [problem, setProblem] = useState<any>(null); 
    const [contestWon, setContestWon] = useState(false);
    const [contestLoss, setContestLoss] = useState(false);
    let [usersCount, setUsersCount] = useState<number>();
    let [AllowedParticipants, setAllowedParticipants] = useState<number>();
    const [isCancelled, setIsCancelled] = useState(false);
    const [countdown, setCountdown] = useState(5);


    let participants: any[] = [];

    useEffect(() => {
        const ws_url = "ws://localhost:3000";
        const newSocket = new WebSocket(ws_url);

        newSocket.onopen = () => {
            console.log('Connection established');
            const msg = {
                Title: "Join-Contest-Room",
                roomId,
                username: localStorage.getItem("name"),
                userId : localStorage.getItem("userId")
            };
            newSocket.send(JSON.stringify(msg));
        };


        newSocket.onmessage = (message) => {
            const parsedMessage = JSON.parse(message.data);
            if (parsedMessage.Title === "Room-Info") {
                setUsers(parsedMessage.users);
                setProblemId(parsedMessage.problemId);
                setAllowedParticipants(parsedMessage.participantCount);
                setUsersCount(parsedMessage.participantEntered);
                participants = parsedMessage.users;
            }

            if(parsedMessage.Title === "Contest-won"){
                console.log("winner")
                setContestWon(true);
            }

            if(parsedMessage.Title === "Contest-Loss"){
                console.log("loser")
                setContestLoss(true);
            }
            if(parsedMessage.Title === "Contest-user-joined"){
                setUsersCount(parsedMessage.particpantEntered);
                setUsers(parsedMessage.users);
            }
        };

        newSocket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, [roomId]); 

    const onLeave = () => {
        const msg = {
          Title : "UserLeft",
          roomId,
          userId : localStorage.getItem("userId")
        }
        socket?.send(JSON.stringify(msg))
        navigate("/");
    }

    useEffect(() => {
        if (problemId) {
            const fetchData = async () => {
                try {
                    const response = await axios.get(`${BACKEND_URL}/api/v1/problem/getProblem/${problemId}`);
                    setProblem(response.data);
                    console.log(response.data);
                } catch (error) {
                    console.error("Error fetching problem data:", error);
                }
            };
            fetchData();
        }
    }, [problemId]); 


    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (usersCount !== AllowedParticipants) {
                setIsCancelled(true);
            }
        }, 30000);

        return () => clearTimeout(timeoutId);
    }, [usersCount, AllowedParticipants]);

    useEffect(() => {
        if (isCancelled || contestLoss || contestWon) {
            const intervalId = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);

            if (countdown === 0) {
                onLeave();
                window.location.href = "/";
            }

            return () => clearInterval(intervalId);
        }
    }, [isCancelled, countdown, contestLoss, contestWon]);

    return (
        <div className="min-h-screen">
            {usersCount !== AllowedParticipants && isCancelled === false &&
                <div className="container mx-auto px-4 py-8">
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>Contest Room: {roomId}</span>
                                <div>{usersCount} and {AllowedParticipants}</div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="items-center space-x-2 mb-4">
                                <span>Participants:</span>
                                {participants.map((user) => (
                                    <div className="flex">
                                        <Users className="h-5 w-5 text-blue-500" />
                                        <div className="pl-2">{user.username === localStorage.getItem("name") ? "You" : user.username}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-center space-x-2 text-yellow-500">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>Waiting for other players to join...</span>
                            </div>
                        </CardContent>
                        <div className="mt-8 text-center">
                            <Button variant="outline" onClick={() => onLeave()}>
                                Leave Contest
                            </Button>
                        </div>
                    </Card>
                </div>
            }
        
            {usersCount === AllowedParticipants && !contestLoss && !contestWon && (
                <div>
                    <div className="flex flex-col">
                        <main className="flex-1 py-8 md:py-12 grid md:grid-cols-2 gap-8 md:gap-12 px-2">
                            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
                                {problem ? (
                                    <div className="prose prose-stone dark:prose-invert">
                                        <ProblemStatement 
                                            description={problem.description} 
                                            difficulty={problem.difficulty} 
                                        />
                                    </div>
                                ) : (
                                    <div className="flex justify-center items-center h-64">
                                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                                    </div>
                                )} 
                            </div>
                            {problem && <SubmitBar problem={problem} isContest={true} />}
                        </main>
                    </div>
                </div>
            )}

            {(contestWon || contestLoss) && (
                <div className="text-center p-8">
                    {contestWon ? (
                        <div className="text-green-500 space-y-4">
                            <Trophy className="h-16 w-16 mx-auto" />
                            <h2 className="text-2xl font-bold">Congratulations! You won the contest!</h2>
                        </div>
                    ) : (
                        <div className="text-red-500 space-y-4">
                            <AlertTriangle className="h-16 w-16 mx-auto" />
                            <h2 className="text-2xl font-bold">You lost the contest. Better luck next time!</h2>
                        </div>
                    )}
                    <p className="mt-4 text-gray-600">Redirecting to home page in {countdown} seconds...</p>
                </div>
            )}

            {isCancelled && 
                <div>
                    <div className="text-center p-8">
                        <div className="text-red-500 space-y-4">
                            <AlertTriangle className="h-16 w-16 mx-auto" />
                            <h2 className="text-2xl font-bold">Contest cancelled due to insufficient participants.</h2>
                        </div>
                        <p className="mt-4 text-gray-600">Redirecting to home page in {countdown} seconds...</p>
                    </div>
                </div>
            }

        </div>
    )
};
