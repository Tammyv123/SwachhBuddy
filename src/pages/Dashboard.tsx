// src/pages/Dashboard.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom"; // 👈 Added
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy as TrophyIcon,
  QrCode,
  Truck,
  Camera,
  Calendar,
  Gift,
  GraduationCap,
  Gamepad2,
  Users,
  BarChart3,
} from "lucide-react"; // 👈 Added missing icons
import { useToast } from "@/hooks/use-toast";
import RewardsSystem from "@/components/RewardsSystem";
import { useAuth } from "@/hooks/use-auth";
import QRScanner from "@/components/QRScanner";
import WasteTracking from "@/components/WasteTracking";
import ReportingSystem from "@/components/ReportingSystem";
import EWasteDay from "@/components/EWasteDay";
import WasteChatbot from "@/components/WasteChatbot";
import Activities from "./Activities";
// 👇 Import Points context
import { usePoints } from "@/contexts/PointsContext";
import { FiHome, FiActivity, FiBook, FiAward } from "react-icons/fi";
import { Progress } from "@/components/ui/progress"; // 👈 Ensure Progress is imported

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // 👇 Coins & earn/redeem from context
  const { coins, earn, redeem } = usePoints();

  const [streak] = useState<number>(7);
  const [weeklyGoal] = useState<number>(500);
  const [weeklyProgress, setWeeklyProgress] = useState<number>(350);
  const [showRewards, setShowRewards] = useState(false);

  // modals
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showWasteTracking, setShowWasteTracking] = useState(false);
  const [showReporting, setShowReporting] = useState(false);
  const [showEWasteDay, setShowEWasteDay] = useState(false);

  // 👇 Wrappers
  const handlePointsEarnedWrapper = (points: number, meta?: { source?: string }) => {
    earn(points, meta);
  };

  const handlePointsRedeemedWrapper = (points: number) => {
    redeem(points);
  };

  const recentActivities = [
    { type: "QR Scan", points: 25, time: "2 hours ago", description: "Scanned waste bin at Park Street" },
    { type: "Training", points: 100, time: "1 day ago", description: "Completed Advanced Composting module" },
    { type: "Report", points: 50, time: "2 days ago", description: "Reported missed collection on Main Road" },
  ];

  const leaderboardData = [
    { rank: 1, name: "Priya Sharma", points: 2850, district: "Mumbai" },
    { rank: 2, name: "Raj Patel", points: 2720, district: "Delhi" },
    { rank: 3, name: "Anita Kumar", points: 2650, district: "Bangalore" },
    { rank: 4, name: user ? (user.displayName || "You") : "You", points: coins, district: "Your District", isUser: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary-glow to-accent text-white p-6 relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Welcome back, {user?.displayName || "User"}! 👋
              </h1>
              <p className="text-white/90">ID: {user?.uid || "—"}</p>
            </div>
            <div className="text-right">
              <div className="bg-white/10 px-3 py-2 rounded-lg inline-flex items-center gap-2">
                <TrophyIcon className="h-4 w-4" />
                <span>Level 1</span>
              </div>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card className="bg-white/10">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{coins}</div>
                <p className="text-sm">Total Points</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{coins}</div>
                <p className="text-sm">Coins Earned</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{streak}</div>
                <p className="text-sm">Day Streak</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">#4</div>
                <p className="text-sm">District Rank</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{Math.round((weeklyProgress / weeklyGoal) * 100)}%</div>
                <p className="text-sm">Weekly Goal</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main content container */}
      <div className="container mx-auto p-5">
        <Tabs defaultValue="overview" className="w-full">
  <TabsList className="grid w-full grid-cols-4 gap-3 rounded-2xl bg-muted/60 p-2 shadow-sm">
    <TabsTrigger
      value="overview"
      className="flex items-center gap-2 rounded-xl py-2 px-3 text-sm font-medium transition-all
                 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent
                 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-white hover:text-primary/90"
    >
      <FiHome className="w-4 h-4" />
      Overview
    </TabsTrigger>

    <TabsTrigger
      value="activities"
      className="flex items-center gap-2 rounded-xl py-2 px-3 text-sm font-medium transition-all
                 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent
                 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-white hover:text-primary/90"
    >
      <FiActivity className="w-4 h-4" />
      Activities
    </TabsTrigger>

    <TabsTrigger
      value="learning"
      className="flex items-center gap-2 rounded-xl py-2 px-3 text-sm font-medium transition-all
                 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent
                 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-white hover:text-primary/90"
    >
      <FiBook className="w-4 h-4" />
      Learning
    </TabsTrigger>

    <TabsTrigger
      value="leaderboard"
      className="flex items-center gap-2 rounded-xl py-2 px-3 text-sm font-medium transition-all
                 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent
                 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-white hover:text-primary/90"
    >
      <FiAward className="w-4 h-4" />
      Leaderboard
    </TabsTrigger>
  </TabsList>



          <TabsContent value="overview" className="space-y-6">
  {/* Quick Actions */}
  <div>
    <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card
        className="cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all"
        onClick={() => setShowQRScanner(true)}
      >
        <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            <QrCode className="h-7 w-7" />
          </div>
          <h3 className="font-semibold">Scan QR Code</h3>
          <p className="text-sm text-muted-foreground">
            Verify waste disposal (+25 pts)
          </p>
        </CardContent>
      </Card>

      <Card
        className="cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all"
        onClick={() => setShowWasteTracking(true)}
      >
        <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            <Truck className="h-7 w-7" />
          </div>
          <h3 className="font-semibold">Track Waste Truck</h3>
          <p className="text-sm text-muted-foreground">
            Locate collection vehicles
          </p>
        </CardContent>
      </Card>

      <Card
        className="cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all"
        onClick={() => setShowReporting(true)}
      >
        <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            <Camera className="h-7 w-7" />
          </div>
          <h3 className="font-semibold">Report Issue</h3>
          <p className="text-sm text-muted-foreground">
            Report missed collection (+50 pts)
          </p>
        </CardContent>
      </Card>

      <Card
        className="cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all"
        onClick={() => setShowEWasteDay(true)}
      >
        <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            <Calendar className="h-7 w-7" />
          </div>
          <h3 className="font-semibold">E-Waste Day</h3>
          <p className="text-sm text-muted-foreground">
            Join monthly collection (+75 pts)
          </p>
        </CardContent>
      </Card>
    </div>
  </div>

  {/* Points Legend & Weekly Progress */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <CardTitle>Points Legend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 bg-muted/30 rounded-md">QR Scan — +25 pts</div>
          <div className="p-3 bg-muted/30 rounded-md">Complete Training — +100 pts</div>
          <div className="p-3 bg-muted/30 rounded-md">Report Issue — +50 pts</div>
          <div className="p-3 bg-muted/30 rounded-md">E-Waste Collection — +75 pts</div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Weekly Progress</CardTitle>
        <CardDescription>You're {weeklyGoal - weeklyProgress} points away</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-2">{weeklyProgress} / {weeklyGoal} pts</div>
        <div className="h-3 bg-muted/20 rounded overflow-hidden">
          <div
            style={{ width: `${Math.min(100, (weeklyProgress / weeklyGoal) * 100)}%` }}
            className="h-full bg-primary"
          />
        </div>
      </CardContent>
    </Card>
  </div>

  <Card>
    <CardHeader>
      <CardTitle>Recent Achievements</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3 bg-success/10 rounded">First Steps — Completed training</div>
        <div className="p-3 bg-success/10 rounded">Week Warrior — 7-day streak</div>
      </div>
    </CardContent>
  </Card>
</TabsContent>

<TabsContent value="activities">
  <Activities />
</TabsContent>

<TabsContent value="learning" className="space-y-6">
  <div className="text-center mb-6">
    <h2 className="text-2xl font-semibold mb-2">Continue Learning</h2>
    <p className="text-muted-foreground">
      Access comprehensive waste management education and interactive games
    </p>
  </div>

  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <GraduationCap className="mr-2 h-5 w-5" />
          Core Training
        </CardTitle>
        <CardDescription>
          Complete the 3-level mandatory training program
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>2/3 levels</span>
          </div>
          <Progress value={67} className="h-2" />
          <Button asChild className="w-full">
            <Link to="/learning">Continue Training</Link>
          </Button>
        </div>
      </CardContent>
    </Card>

    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Gamepad2 className="mr-2 h-5 w-5" />
          Learning Games
        </CardTitle>
        <CardDescription>
          Play interactive games to reinforce your knowledge
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Games Played</span>
            <span>12</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Points Earned</span>
            <span>850 pts</span>
          </div>
          <Button asChild variant="outline" className="w-full">
            <Link to="/learning">Play Games</Link>
          </Button>
        </div>
      </CardContent>
    </Card>

    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Users className="mr-2 h-5 w-5" />
          Specialized Courses
        </CardTitle>
        <CardDescription>
          Role-specific training for your user type
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Button asChild variant="secondary" className="w-full">
            <Link to="/learning">Explore Courses</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>

  {/* Learning Stats */}
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center">
        <BarChart3 className="mr-2 h-5 w-5" />
        Learning Progress
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">67%</div>
          <div className="text-sm text-muted-foreground">Training Complete</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-success">12</div>
          <div className="text-sm text-muted-foreground">Games Played</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-warning">5</div>
          <div className="text-sm text-muted-foreground">Certificates Earned</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-accent">850</div>
          <div className="text-sm text-muted-foreground">Learning Points</div>
        </div>
      </div>
    </CardContent>
  </Card>
</TabsContent>

<TabsContent value="leaderboard">
  <Card>
    <CardHeader>
      <CardTitle>District Leaderboard</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {leaderboardData.map((u, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-between p-3 rounded ${u.isUser ? "bg-primary/10" : "bg-muted/30"}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold">{u.rank}</div>
              <div>
                <div className="font-medium">{u.name} {u.isUser && "(You)"}</div>
                <div className="text-sm text-muted-foreground">{u.district}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-primary">{u.points} pts</div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
</TabsContent>

        </Tabs>
      </div>

      {/* Modals */}
      <QRScanner
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onPointsEarned={(pts: number) => handlePointsEarnedWrapper(pts, { source: "QR" })}
      />

      <WasteTracking
        isOpen={showWasteTracking}
        onClose={() => setShowWasteTracking(false)}
      />

      <ReportingSystem
        isOpen={showReporting}
        onClose={() => setShowReporting(false)}
        onPointsEarned={(pts: number) => handlePointsEarnedWrapper(pts, { source: "Report" })}
      />

      <EWasteDay
        isOpen={showEWasteDay}
        onClose={() => setShowEWasteDay(false)}
      />

      <WasteChatbot />

      {showRewards && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-6 overflow-auto">
          <div className="bg-white w-full max-w-6xl rounded-lg shadow-xl">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Rewards</h3>
              <Button variant="ghost" onClick={() => setShowRewards(false)}>Close</Button>
            </div>
            <div style={{ minHeight: 600 }}>
              <RewardsSystem
                onBack={() => setShowRewards(false)}
                onRedeem={(points: number) => handlePointsRedeemedWrapper(points)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
