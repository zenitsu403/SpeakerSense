import React, { useEffect, useState } from 'react';
import { 
  Mic, 
  UserPlus, 
  FileText, 
  Clock,
  Brain,
  MessageSquare,
  Users,
  Bot,
  ChevronRight,
  Play,
  Activity,
  PieChart,
  Search,
  Download,
  BarChart,
  Timer,
  TrendingUp,
  ArrowUpRight,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 border border-gray-700">
    <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
      <Icon className="h-6 w-6 text-blue-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-200 mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

const WaveformAnimation = () => {
  const [waveformHeights, setWaveformHeights] = useState(Array(8).fill(50));

  useEffect(() => {
    const interval = setInterval(() => {
      setWaveformHeights((prevHeights) =>
        prevHeights.map((height) => 
          Math.min(100, Math.max(10, height + (Math.random() - 0.5) * 10)) // Small, gradual height changes
        )
      );
    }, 200); // Smaller interval for smoother animation

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center gap-1 h-12">
      {waveformHeights.map((height, index) => (
        <div
          key={index}
          className="w-1 rounded-full bg-blue-500/80 animate-waveform"
          style={{
            height: `${height}%`,
            animationDelay: `${index * 0.1}s`,
            animationDuration: '1.2s', // Slightly slower animation duration
          }}
        />
      ))}
    </div>
  );
};

const Home = () => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  return (
    <main>
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              Understand Your Conversations Better
            </h1>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Advanced speaker diarization and meeting analysis that transforms multi-speaker conversations into searchable, analyzable insights
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
              <button 
                className="px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-500 transition-all duration-300 flex items-center space-x-2 group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => navigate('./upload')}
              >
                <FileText className="h-5 w-5" />
                <span>Upload Audio File</span>
                <ChevronRight className={`h-5 w-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
              </button>
              <button className="px-8 py-4 rounded-lg border border-gray-700 hover:bg-gray-800/50 transition-all duration-300">
                View Demo Analysis
              </button>
            </div>

            <div className="max-w-4xl mx-auto p-8 rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700">
              <WaveformAnimation />
              <div className="mt-4 p-4 rounded-lg bg-gray-800/50 text-left">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-green-400"></div>
                  <span className="text-sm text-gray-400">Analysis Complete - 45:23 min meeting</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-24 text-sm text-gray-500">Speaker 1:</div>
                    <div className="text-gray-300">"The Q4 results show a 15% increase in user engagement..." [02:15]</div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-24 text-sm text-gray-500">Speaker 2:</div>
                    <div className="text-gray-300">"We should focus on mobile optimization next..." [02:45]</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20 px-6 bg-gray-900">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={UserPlus}
                title="Speaker Recognition"
                description="Accurately identify and label different speakers throughout the conversation"
              />
              <FeatureCard
                icon={Clock}
                title="Timeline Analysis"
                description="Interactive transcript with precise timestamps and speaker transitions"
              />
              <FeatureCard
                icon={Brain}
                title="Smart Summarization"
                description="Get extractive summaries for each speaker's contributions"
              />
              <FeatureCard
                icon={Search}
                title="Advanced Search"
                description="Search through transcripts by speaker, topic, or keyword"
              />
              <FeatureCard
                icon={PieChart}
                title="Speaker Analytics"
                description="Analyze speaking time, interruptions, and engagement metrics"
              />
              <FeatureCard
                icon={Download}
                title="Export Options"
                description="Download analysis in PDF, Word, or custom report formats"
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 px-6">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="max-w-3xl mx-auto">
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">1. Upload Your Audio</h3>
                    <p className="text-gray-400">Upload any multi-speaker audio file - meetings, interviews, or group discussions.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">2. Speaker Identification</h3>
                    <p className="text-gray-400">Our AI automatically identifies and labels different speakers in the conversation.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Brain className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">3. Generate Analysis</h3>
                    <p className="text-gray-400">Get comprehensive transcripts, summaries, and analytics for each speaker.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="analytics" className="py-20 px-6 bg-gray-800/30">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Meeting Analytics Dashboard</h2>
            
            {/* Analytics Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <Timer className="h-6 w-6 text-blue-400" />
                  <span className="text-sm text-gray-400">Total Duration</span>
                </div>
                <div className="text-2xl font-bold">45:23</div>
                <div className="text-sm text-gray-400">minutes</div>
              </div>
              
              <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <Users className="h-6 w-6 text-blue-400" />
                  <span className="text-sm text-gray-400">Participants</span>
                </div>
                <div className="text-2xl font-bold">5</div>
                <div className="text-sm text-gray-400">speakers detected</div>
              </div>
              
              <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <MessageSquare className="h-6 w-6 text-blue-400" />
                  <span className="text-sm text-gray-400">Total Segments</span>
                </div>
                <div className="text-2xl font-bold">127</div>
                <div className="text-sm text-gray-400">conversation turns</div>
              </div>
              
              <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="h-6 w-6 text-blue-400" />
                  <span className="text-sm text-gray-400">Engagement Score</span>
                </div>
                <div className="text-2xl font-bold">8.5</div>
                <div className="text-sm text-gray-400">out of 10</div>
              </div>
            </div>

            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Speaker Timeline */}
              <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700">
                <h3 className="text-xl font-semibold mb-4">Speaker Timeline</h3>
                <div className="space-y-4">
                  {['Speaker 1', 'Speaker 2', 'Speaker 3', 'Speaker 4', 'Speaker 5'].map((speaker, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-300">{speaker}</span>
                        <span className="text-sm text-gray-400">{Math.floor(Math.random() * 20) + 5} min</span>
                      </div>
                      <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-400 rounded-full"
                          style={{ width: `${Math.floor(Math.random() * 60) + 20}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Topics */}
              <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700">
                <h3 className="text-xl font-semibold mb-4">Key Topics Discussed</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { topic: 'Product Updates', time: '12:05', count: 15 },
                    { topic: 'User Feedback', time: '08:30', count: 12 },
                    { topic: 'Timeline', time: '06:45', count: 8 },
                    { topic: 'Budget', time: '05:20', count: 7 },
                    { topic: 'Marketing', time: '04:15', count: 6 },
                    { topic: 'Development', time: '03:40', count: 5 }
                  ].map((item, index) => (
                    <div key={index} className="p-3 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-200">{item.topic}</span>
                        <ArrowUpRight className="h-4 w-4 text-blue-400" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">{item.time} mins</span>
                        <span className="text-xs text-gray-400">{item.count} mentions</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Engagement Metrics */}
              <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700">
                <h3 className="text-xl font-semibold mb-4">Engagement Metrics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">Speaking Pace</span>
                      <span className="text-sm text-gray-400">145 words/min</span>
                    </div>
                    <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-green-400 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">Turn-taking Balance</span>
                      <span className="text-sm text-gray-400">85%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">Interaction Rate</span>
                      <span className="text-sm text-gray-400">92%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-400 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Items */}
              <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700">
                <h3 className="text-xl font-semibold mb-4">Action Items Detected</h3>
                <div className="space-y-3">
                  {[
                    { text: "Review Q4 marketing strategy by Friday", owner: "Speaker 1", time: "15:30" },
                    { text: "Schedule follow-up meeting with dev team", owner: "Speaker 3", time: "23:45" },
                    { text: "Share updated metrics dashboard", owner: "Speaker 2", time: "35:20" },
                    { text: "Finalize budget proposal", owner: "Speaker 4", time: "42:15" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-700/50 rounded-lg">
                      <div className="h-5 w-5 mt-0.5 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-4 w-4 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-200">{item.text}</p>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-xs text-gray-400">{item.owner}</span>
                          <span className="text-xs text-gray-500">at {item.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;