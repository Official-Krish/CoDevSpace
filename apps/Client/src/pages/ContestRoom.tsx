import { ProblemStatement } from "../components/ProblemStatement";
import SubmitBar from "../components/ProblemSubmitBar";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { useEffect, useState } from "react";

export const ContestRoom = ({ roomId }: { roomId: string }) => {
    window.history.pushState(null, '', '/contest?id=' + roomId);

    const [users, setUsers] = useState<string[]>([]);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [problemId, setProblemId] = useState('');
    const [problem, setProblem] = useState<any>(null); // Initialize as null

    useEffect(() => {
        const ws_url = "ws://localhost:3000";
        const newSocket = new WebSocket(ws_url);

        newSocket.onopen = () => {
            console.log('Connection established');
            const msg = {
                Title: "Join-Contest-Room",
                roomId,
                username: localStorage.getItem("name")
            };
            newSocket.send(JSON.stringify(msg));
        };

        newSocket.onmessage = (message) => {
            const parsedMessage = JSON.parse(message.data);
            if (parsedMessage.Title === "Room-Info") {
                setUsers(parsedMessage.users);
                setProblemId(parsedMessage.problemId);
            }
        };

        newSocket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, [roomId]); // Added roomId to dependencies

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
    }, [problemId]); // Added problemId to dependencies

    return (
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
                            <p>Loading problem...</p> // Loading state
                        )}
                    </div>
                    {problem && <SubmitBar problem={problem} />}
                </main>
            </div>
        </div>
    );
};
