import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"
import { Code2, Trophy, Star, Activity, GitBranch, Clock, CheckCircle, XCircle } from "lucide-react"

type UserProfile = {
  name: string
  username: string
  avatar: string
  bio: string
  joinDate: string
  problemsSolved: number
  totalProblems: number
  rank: number
  contestsParticipated: number
  contributions: number
}

type RecentActivity = {
  id: string
  type: "problem" | "contest" | "contribution"
  name: string
  date: string
  result?: "Solved" | "Attempted" | "Participated"
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])

  useEffect(() => {
    // Simulated API call to fetch user profile
    const fetchProfile = async () => {
      const mockProfile: UserProfile = {
        name: "Jane Doe",
        username: "janedoe123",
        avatar: "/placeholder.svg",
        bio: "Passionate coder | AI enthusiast | Open source contributor",
        joinDate: "January 2023",
        problemsSolved: 157,
        totalProblems: 500,
        rank: 1337,
        contestsParticipated: 12,
        contributions: 23
      }
      setProfile(mockProfile)
    }

    // Simulated API call to fetch recent activity
    const fetchRecentActivity = async () => {
      const mockActivity: RecentActivity[] = [
        { id: "1", type: "problem", name: "Two Sum", date: "2023-05-15", result: "Solved" },
        { id: "2", type: "contest", name: "Weekly Contest 345", date: "2023-05-13", result: "Participated" },
        { id: "3", type: "problem", name: "Longest Palindromic Substring", date: "2023-05-10", result: "Attempted" },
        { id: "4", type: "contribution", name: "Fixed typo in problem description", date: "2023-05-08" },
        { id: "5", type: "problem", name: "Valid Parentheses", date: "2023-05-05", result: "Solved" },
      ]
      setRecentActivity(mockActivity)
    }

    fetchProfile()
    fetchRecentActivity()
  }, [])

  if (!profile) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
            <Avatar className="w-32 h-32 border-4 border-blue-500">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback className="text-black text-3xl">{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold">{profile.name}</h1>
              <p className="text-xl text-gray-400">@{profile.username}</p>
              <p className="mt-2 text-gray-300">{profile.bio}</p>
              <div className="flex items-center justify-center md:justify-start mt-2 text-sm text-gray-400">
                <Clock className="mr-2 h-4 w-4" />
                Joined {profile.joinDate}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-300">Coding Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="text-gray-300">Problems Solved</span>
                    <span className="text-gray-300">{profile.problemsSolved} / {profile.totalProblems}</span>
                  </div>
                  <Progress value={(profile.problemsSolved / profile.totalProblems) * 100} className="h-2 bg-zinc-50" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-3xl font-bold text-blue-400">{profile.problemsSolved}</p>
                    <p className="text-sm text-gray-400">Problems Solved</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-3xl font-bold text-green-400">{profile.rank}</p>
                    <p className="text-sm text-gray-400">Global Rank</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-300">Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  <div>
                    <p className="text-lg font-semibold text-gray-200">{profile.contestsParticipated}</p>
                    <p className="text-sm text-gray-400">Contests</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <div>
                    <p className="text-lg font-semibold text-gray-200">{profile.rank}</p>
                    <p className="text-sm text-gray-400">Rank</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-lg font-semibold text-gray-200">{profile.problemsSolved}</p>
                    <p className="text-sm text-gray-400">Solved</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <GitBranch className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-lg font-semibold text-gray-200">{profile.contributions}</p>
                    <p className="text-sm text-gray-400">Contributions</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-300">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentActivity.map((activity) => (
                <li key={activity.id} className="bg-gray-700 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-300">{activity.name}</p>
                    <p className="text-sm text-gray-400">{activity.date}</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`flex items-center ${
                      activity.result === "Solved" ? "text-green-400 border-green-400" :
                      activity.result === "Attempted" ? "text-yellow-400 border-yellow-400" :
                      "text-blue-400 border-blue-400"
                    }`}
                  >
                    {activity.result === "Solved" && <CheckCircle className="mr-1 h-4 w-4" />}
                    {activity.result === "Attempted" && <XCircle className="mr-1 h-4 w-4" />}
                    {activity.result || "Contributed"}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}