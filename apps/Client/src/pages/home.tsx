import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Zap, Users, Bot, Video, Trophy, Brain, Star } from "lucide-react"


export default function Component() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-5"></div>
      
      <main className="relative z-10">
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  Elevate Your
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                    Coding Journey
                  </span>
                </h1>
                <p className="text-xl text-gray-300 max-w-md">
                  Join CoDevSpace, where problem-solving meets collaboration. Challenge yourself, compete with friends, and code in real-time with AI-powered assistance.
                </p>
                <div className="flex space-x-4">
                  <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg" onClick={() => navigate("/problems")}>
                    Start Coding Now
                  </Button>
                  <Button variant="outline" className="bg-transparent text-teal-400 border-2 border-teal-400 hover:bg-teal-400 hover:text-gray-900 font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105">
                    Explore Features
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg blur-lg opacity-75 animate-pulse"></div>
                <div className="relative bg-gray-800 p-8 rounded-lg shadow-2xl">
                  <pre className="text-sm text-teal-400">
                    <code>{`function solveChallenge(code) {
  // Your brilliant solution here
  return AI.assist(code);
}

// Real-time collaboration
team.connect();
videoChat.start();

// Start coding!
solveChallenge(yourCode);

// Track progress
leaderboard.update(user.score);`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-20 bg-gray-800">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-3xl lg:text-5xl font-bold text-center mb-12">Unleash Your Coding Potential</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <button onClick={() => navigate("/problems")}>
                <FeatureCard
                  icon={<Zap className="h-10 w-10 text-blue-400" />}
                  title="Advanced Problem Solving"
                  description="Tackle a vast array of coding challenges, from beginner to expert level, covering multiple programming languages and paradigms."
                />
              </button>

              <button onClick={() => navigate("/createContest")}>
                <FeatureCard
                  icon={<Users className="h-10 w-10 text-teal-400" />}
                  title="Friend Challenges"
                  description="Create custom coding battles, invite friends, and compete in real-time. Track your progress on global and friend leaderboards."
                />
              </button>

              <button onClick={() => navigate("/create")}>
                <FeatureCard
                  icon={<Video className="h-10 w-10 text-blue-400" />}
                  title="Real-time Collaboration"
                  description="Code together seamlessly with integrated video and voice chat. Share screens, debug together, and learn from peers in real-time."
                />
              </button>
              
              <button>
                <FeatureCard
                  icon={<Bot className="h-10 w-10 text-teal-400" />}
                  title="AI Coding Assistant"
                  description="Get intelligent code suggestions, error explanations, and optimization tips from our advanced AI. Enhance your coding skills with personalized assistance."
                />
              </button>
            </div>
          </div>
        </section>
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-3xl lg:text-5xl font-bold text-center mb-12">Why Developers Choose CoDevSpace</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <ReasonCard
                icon={<Trophy className="h-8 w-8 text-blue-400" />}
                title="Gamified Learning"
                description="Earn badges, climb leaderboards, and unlock achievements as you improve your coding skills."
              />
              <ReasonCard
                icon={<Brain className="h-8 w-8 text-teal-400" />}
                title="Diverse Challenge Types"
                description="From algorithmic puzzles to real-world coding scenarios, our platform offers a wide range of challenge types to keep you engaged."
              />
              <ReasonCard
                icon={<Star className="h-8 w-8 text-blue-400" />}
                title="Community-Driven"
                description="Join a thriving community of developers. Share solutions, participate in code reviews, and grow together."
              />
            </div>
          </div>
        </section>
        <section className="py-20 bg-gray-800">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-3xl lg:text-5xl font-bold text-center mb-12">What Our Users Say</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <TestimonialCard
                quote="CoDevSpace has transformed the way I approach coding challenges. The real-time collaboration feature is a game-changer for team projects!"
                author="User1"
                role="Full Stack Developer"
              />
              <TestimonialCard
                quote="The AI assistant is like having a coding mentor available 24/7. It's helped me improve my problem-solving skills tremendously."
                author="User2"
                role="Data Scientist"
              />
              <TestimonialCard
                quote="Competing with friends on CoDevSpace has made learning to code fun and addictive. I've never been so motivated to tackle challenging problems!"
                author="User3"
                role="Computer Science Student"
              />
            </div>
          </div>
        </section>
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-12 lg:p-20 text-center">
              <h2 className="text-3xl lg:text-5xl font-bold mb-6">Ready to Join the Coding Elite?</h2>
              <p className="text-xl text-gray-100 mb-8">
                Start your journey to becoming a coding master today. Sign up for early access and get 3 months free!
              </p>
              <form className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Input
                  className="max-w-md bg-white/10 border-white/20 text-white placeholder-gray-900"
                  placeholder="Enter your email"
                  type="email"
                />
                <Button className="bg-white text-blue-600 hover:bg-gray-100">
                  Get Early Access
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function FeatureCard({ icon, title, description } : { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg transition-transform hover:scale-105">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  )
}

function ReasonCard({ icon, title, description } : { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg text-center">
      <div className="inline-block p-3 bg-gray-700 rounded-full mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  )
}

function TestimonialCard({ quote, author, role } : { quote: string, author: string, role: string }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <p className="text-gray-300 mb-4">"{quote}"</p>
      <div className="flex items-center">
        <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
          <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
        </div>
        <div className="ml-3">
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-gray-400">{role}</p>
        </div>
      </div>
    </div>
  )
}