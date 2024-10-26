import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Users, Clock, Search, PlusCircle, Trophy } from "lucide-react"
import { Badge } from "../components/ui/badge"
import { useNavigate } from "react-router-dom"
import { useUserStore } from "../store"
import axios from "axios"
import { BACKEND_URL } from "../../config"

type Contest = {
  roomId: string
  roomName: string
  host: string
  participantCount: number
  participantEntered: number
}

export default function ContestPage() {
  const [contests, setContests] = useState<Contest[]>([])
  const navigate = useNavigate();
  const { setRoomID } = useUserStore();

  useEffect(() => {
    const fetchContests = async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/contest/getContests`, {
          withCredentials : true,
        })
        setContests(response.data)
    }
    fetchContests()
  }, [])

  
  const handleJoinContest = (contestId : string) => {
    setRoomID(contestId);
    navigate(`/joinContest`);
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-500'
      case 'medium': return 'bg-yellow-500'
      case 'hard': return 'bg-red-500'
      case 'expert': return 'bg-purple-500'
      default: return 'bg-blue-500'
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                Coding Contests
            </h1>
            <div className="flex space-x-4">
                <Button className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600" onClick={() => navigate("/createContest")}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Create Contest
                </Button>
                <Button className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600" onClick={() => navigate("/joinContest")}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Join Contest
                </Button>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" onClick={() => navigate("/leaderboard")}>
                    <Trophy className="mr-2 h-4 w-4" /> Leaderboard
                </Button>
            </div>
        </div>
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Input
              type="text"
              placeholder="Search contests..."
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <Select>
            <SelectTrigger className="w-full sm:w-40 bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests.map((contest) => (
            <Card key={contest.roomId} className="bg-gray-800 border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-bold text-white">{contest.roomName}</CardTitle>
                  <Badge className={`${getDifficultyColor("Medium")} text-white`}>
                    {"Medium"}
                  </Badge>
                </div>
                <CardDescription className="text-gray-400">Hosted by {contest.host}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-blue-400 mr-2" />
                    <span className="text-gray-400">{contest.participantEntered} / {contest.participantCount}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-green-400 mr-2" />
                    <span className="text-gray-400">{"60"} min</span>
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-blue-500 h-2.5 rounded-full" 
                    style={{ width: `${(contest.participantEntered / contest.participantCount) * 100}%` }}
                  ></div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button 
                  onClick={() => handleJoinContest(contest.roomId)}
                  disabled={contest.participantCount === contest.participantEntered}
                  className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 transition-all duration-300"
                >
                  {contest.participantCount === contest.participantEntered ? "Contest Full" : "Join Contest"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}