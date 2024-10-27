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
import { Search, Trophy, Medal } from 'lucide-react'
import axios from 'axios'
import { BACKEND_URL } from '../../config'

type Participant = {
  rank: number
  name: string
  avatar: string
  Contest_Points: number
  Total_Contests: number
}

export default function LeaderboardPage() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [contestFilter, setContestFilter] = useState('all')

  useEffect(() => {
    // In a real application, this would be an API call
    async function fetchDetails() {
      const response = await axios.get(`${BACKEND_URL}/api/v1/contest/getLeaderboard`,
        {
          withCredentials: true
        }
      )
      setParticipants(response.data)
    } 
    fetchDetails()
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
                <SelectItem value="weekly">Friendly</SelectItem>
                <SelectItem value="biweekly">Global</SelectItem>
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
                    <TableHead className="text-right pr-11">Total Contests</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {filteredParticipants.map((participant, index) => (
                    <TableRow key={index} className={`${participant.name === localStorage.getItem("name") ? 'bg-gray-600' : ''}`}>
                    <TableCell className="font-medium text-center">
                        <div className="flex items-center justify-center">
                          <span className={`mr-2 ${getRankColor(index + 1)}`}>{index + 1}</span>
                          {getRankIcon(index + 1)}
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
                    <TableCell className="text-right">{participant.Contest_Points}</TableCell>
                    <TableCell className="text-right pr-11">
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-400">
                        {participant.Total_Contests}
                        </Badge>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </ScrollArea>
        </main>
    </div>
  )
}