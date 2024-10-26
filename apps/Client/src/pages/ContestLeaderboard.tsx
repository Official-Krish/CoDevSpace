import  { useState, useEffect } from 'react'
import { Input } from "../components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import { Badge } from "../components/ui/badge"
import { ScrollArea } from "../components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Search, Clock, Trophy, Medal, User } from 'lucide-react'

type Participant = {
  rank: number
  name: string
  avatar: string
  score: number
  finishTime: string
  q1Time: string
  q2Time: string
  q3Time: string
  q4Time: string
}

export default function LeaderboardPage() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [contestFilter, setContestFilter] = useState('all')
  const [userRank, setUserRank] = useState<Participant | null>(null)

  useEffect(() => {
    // In a real application, this would be an API call
    const mockParticipants: Participant[] = [
      { rank: 1, name: "Arnab Manna", avatar: "/placeholder.svg", score: 19, finishTime: "00:13:12", q1Time: "00:02:56", q2Time: "00:08:00", q3Time: "00:13:12", q4Time: "00:10:18" },
      { rank: 2, name: "duhlavya", avatar: "/placeholder.svg", score: 19, finishTime: "00:13:15", q1Time: "00:05:14", q2Time: "00:07:22", q3Time: "00:10:04", q4Time: "00:13:15" },
      { rank: 3, name: "Astatine", avatar: "/placeholder.svg", score: 19, finishTime: "00:19:03", q1Time: "00:05:06", q2Time: "00:07:37", q3Time: "00:11:00", q4Time: "00:19:03" },
      { rank: 4, name: "Nikhil Kumar", avatar: "/placeholder.svg", score: 19, finishTime: "00:19:54", q1Time: "00:01:04", q2Time: "00:02:18", q3Time: "00:04:04", q4Time: "00:14:54" },
      { rank: 5, name: "TsReaper", avatar: "/placeholder.svg", score: 19, finishTime: "00:20:50", q1Time: "00:03:27", q2Time: "00:08:08", q3Time: "00:12:00", q4Time: "00:20:50" },
      { rank: 6, name: "Nihar Jyoti", avatar: "/placeholder.svg", score: 19, finishTime: "00:21:21", q1Time: "00:02:54", q2Time: "00:07:35", q3Time: "00:11:10", q4Time: "00:21:21" },
      { rank: 7, name: "PyIsBestLang", avatar: "/placeholder.svg", score: 19, finishTime: "00:21:58", q1Time: "00:01:21", q2Time: "00:08:20", q3Time: "00:11:37", q4Time: "00:21:58" },
      { rank: 8, name: "Relaxed Vis", avatar: "/placeholder.svg", score: 19, finishTime: "00:21:59", q1Time: "00:01:26", q2Time: "00:05:05", q3Time: "00:07:03", q4Time: "00:16:59" },
      { rank: 9, name: "Ujimatsu_C", avatar: "/placeholder.svg", score: 19, finishTime: "00:22:35", q1Time: "00:03:20", q2Time: "00:10:08", q3Time: "00:14:10", q4Time: "00:22:35" },
      { rank: 10, name: "Bholaa", avatar: "/placeholder.svg", score: 19, finishTime: "00:22:41", q1Time: "00:03:54", q2Time: "00:07:39", q3Time: "00:12:22", q4Time: "00:22:41" },
    ]
    setParticipants(mockParticipants)

    // Simulating the current user's rank
    // In a real application, this would come from the API or user session
    setUserRank({
      rank: 42,
      name: "Current User",
      avatar: "/placeholder.svg",
      score: 15,
      finishTime: "00:45:30",
      q1Time: "00:10:15",
      q2Time: "00:15:20",
      q3Time: "00:20:25",
      q4Time: "00:45:30"
    })
  }, [])

  const filteredParticipants = participants.filter(participant =>
    participant.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-400'
      case 2: return 'text-gray-400'
      case 3: return 'text-amber-600'
      default: return 'text-blue-400'
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-400" />
      case 2: return <Medal className="h-5 w-5 text-gray-400" />
      case 3: return <Medal className="h-5 w-5 text-amber-600" />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                Leaderboard
            </h1>
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-64">
                <Input
                type="text"
                placeholder="Search participants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <Select value={contestFilter} onValueChange={setContestFilter}>
                <SelectTrigger className="w-full sm:w-40 bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Filter Contests" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="all">All Contests</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Biweekly</SelectItem>
                </SelectContent>
            </Select>
            </div>
            <ScrollArea className="h-[calc(100vh-20rem)] rounded-md border border-gray-700">
            <Table>
                <TableHeader className="bg-gray-800 sticky top-0">
                <TableRow>
                    <TableHead className="w-16 text-center">Rank</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead className="text-right">Finish Time</TableHead>
                    <TableHead className="text-right">Q1</TableHead>
                    <TableHead className="text-right">Q2</TableHead>
                    <TableHead className="text-right">Q3</TableHead>
                    <TableHead className="text-right">Q4</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {filteredParticipants.map((participant) => (
                    <TableRow key={participant.rank} className="hover:bg-gray-800/50">
                    <TableCell className="font-medium text-center">
                        <div className="flex items-center justify-center">
                        <span className={`mr-2 ${getRankColor(participant.rank)}`}>{participant.rank}</span>
                        {getRankIcon(participant.rank)}
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={participant.avatar} alt={participant.name} />
                            <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {participant.name}
                        </div>
                    </TableCell>
                    <TableCell className="text-right">{participant.score}</TableCell>
                    <TableCell className="text-right">
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-400">
                        <Clock className="mr-1 h-3 w-3" />
                        {participant.finishTime}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">{participant.q1Time}</TableCell>
                    <TableCell className="text-right">{participant.q2Time}</TableCell>
                    <TableCell className="text-right">{participant.q3Time}</TableCell>
                    <TableCell className="text-right">{participant.q4Time}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </ScrollArea>
        </main>
        {userRank && (
            <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={userRank.avatar} alt={userRank.name} />
                    <AvatarFallback><User /></AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{userRank.name}</p>
                    <p className="text-sm text-gray-400">Your Current Rank</p>
                </div>
                </div>
                <div className="flex items-center space-x-4">
                <div className="text-center">
                    <p className="text-2xl font-bold">{userRank.rank}</p>
                    <p className="text-xs text-gray-400">Rank</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold">{userRank.score}</p>
                    <p className="text-xs text-gray-400">Score</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold">{userRank.finishTime}</p>
                    <p className="text-xs text-gray-400">Time</p>
                </div>
                </div>
            </div>
            </div>
        )}
    </div>
  )
}