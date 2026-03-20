// src/pages/Dashboard/EDashboard.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy as TrophyIcon,
  QrCode,
  Truck,
  Calendar,
  GraduationCap,
  Gamepad2,
  Users,
  BarChart3,
  CheckCircle,
  Clock,
  MapPin,
  Download,
  AlertTriangle,
  ClipboardList,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RewardsSystem from "@/components/RewardsSystem";
import { useAuth } from "@/hooks/use-auth";
import WasteTracking from "@/components/WasteTracking";
import EWasteDay from "@/components/EWasteDay";
import WasteChatbot from "@/components/WasteChatbot";
import Activities from "../Activities";
import { usePoints } from "@/contexts/PointsContext";
import { FiHome, FiActivity, FiBook, FiAward } from "react-icons/fi";
import { Progress } from "@/components/ui/progress";
import SchedulePickup from "@/components/SchedulePickup";

const EDashboard: React.FC = () => {
  const { user, userData } = useAuth();
  const { toast } = useToast();
  const { coins, earn, redeem } = usePoints();

  const [streak, setStreak] = useState<number>(7);
  const [weeklyGoal] = useState<number>(500);
  const [weeklyProgress] = useState<number>(350);
  const [showRewards, setShowRewards] = useState(false);
  const [showWasteTracking, setShowWasteTracking] = useState(false);
  const [showEWasteDay, setShowEWasteDay] = useState(false);
  const [showSchedulePickup, setShowSchedulePickup] = useState(false);
  const [generatedQR, setGeneratedQR] = useState<string>("");
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [scansToday, setScansToday] = useState<number>(3);

  // Mock citizen pickup requests
  const [pickupRequests, setPickupRequests] = useState([
    { id: "REQ001", citizen: "Aisha Khan", address: "12/A, Sector 4, Delhi", type: "Dry Waste", scheduledTime: "Today, 10:00 AM", status: "pending" },
    { id: "REQ002", citizen: "Mohan Das", address: "B-7, Green Park, Delhi", type: "Wet Waste", scheduledTime: "Today, 11:30 AM", status: "pending" },
    { id: "REQ003", citizen: "Sunita Sharma", address: "Plot 5, Rohini Sector 3", type: "E-Waste", scheduledTime: "Today, 2:00 PM", status: "completed" },
    { id: "REQ004", citizen: "Ravi Kumar", address: "Flat 201, DDA Flats, Dwarka", type: "Hazardous", scheduledTime: "Tomorrow, 9:00 AM", status: "pending" },
  ]);

  const leaderboardData = [
    { rank: 1, name: "Priya Sharma", points: 2850, district: "Mumbai" },
    { rank: 2, name: "Raj Patel", points: 2720, district: "Delhi" },
    { rank: 3, name: "Anita Kumar", points: 2650, district: "Bangalore" },
    { rank: 4, name: user ? (user.displayName || "You") : "You", points: coins, district: "Your District", isUser: true },
  ];

  const handleGenerateQR = async () => {
    setIsGeneratingQR(true);
    try {
      const empId = userData?.employeeId || user?.uid?.slice(0, 8) || "EMP001";
      const qrData = `SWACHH-EMP-${empId}-${Date.now()}`;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&color=166534&bgcolor=ffffff&data=${encodeURIComponent(qrData)}&format=png&margin=10`;
      setGeneratedQR(qrUrl);
      toast({
        title: "QR Code Generated! ✅",
        description: "Share this with citizens. Each scan gives them +25 pts and increases your garbage streak!",
      });
    } catch {
      toast({ title: "Error", description: "Could not generate QR. Try again." });
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const handleDownloadQR = () => {
    if (!generatedQR) return;
    const link = document.createElement("a");
    link.href = generatedQR;
    link.download = `swachh-buddy-emp-qr.png`;
    link.target = "_blank";
    link.click();
  };

  const handleCitizenScanned = () => {
    // Simulates what happens when a citizen scans the employee QR
    setScansToday(prev => prev + 1);
    setStreak(prev => prev + 1);
    earn(10, { source: "citizen-scan" });
    toast({
      title: "Citizen Scanned Your QR! 🎉",
      description: "Citizen earned +25 pts. Your garbage streak increased! (+10 pts for you)",
    });
  };

  const handleCompletePickup = (reqId: string) => {
    setPickupRequests(prev =>
      prev.map(r => r.id === reqId ? { ...r, status: "completed" } : r)
    );
    earn(30, { source: "pickup-completed" });
    toast({
      title: "Pickup Completed! ✅",
      description: `Request ${reqId} marked as completed. +30 pts earned!`,
    });
  };

  const handlePointsRedeemedWrapper = (points: number) => {
    redeem(points);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary-glow to-accent text-white p-6 relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">
                Welcome, {user?.displayName || "Employee"}! 👷
              </h1>
              <p className="text-white/90 text-sm">
                Municipal Employee · ID: {userData?.employeeId || (user?.uid?.slice(0, 10) + "...")}
              </p>
              {userData?.department && (
                <p className="text-white/70 text-xs mt-1">Dept: {userData.department}</p>
              )}
            </div>
            <div className="bg-white/10 px-3 py-2 rounded-lg inline-flex items-center gap-2">
              <TrophyIcon className="h-4 w-4" />
              <span>Level 1</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-3 text-center text-white">
                <div className="text-xl font-bold">{coins}</div>
                <p className="text-xs text-white/80">Total Points</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-3 text-center text-white">
                <div className="text-xl font-bold">{scansToday}</div>
                <p className="text-xs text-white/80">Scans Today</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-3 text-center text-white">
                <div className="text-xl font-bold">🔥 {streak}</div>
                <p className="text-xs text-white/80">Garbage Streak</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-3 text-center text-white">
                <div className="text-xl font-bold">
                  {pickupRequests.filter(r => r.status === "pending").length}
                </div>
                <p className="text-xs text-white/80">Pending Pickups</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-3 text-center text-white">
                <div className="text-xl font-bold">
                  {Math.round((weeklyProgress / weeklyGoal) * 100)}%
                </div>
                <p className="text-xs text-white/80">Weekly Goal</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-5">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 gap-3 rounded-2xl bg-muted/60 p-2 shadow-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2 rounded-xl py-2 px-3 text-sm font-medium transition-all
              data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent
              data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-white hover:text-primary/90">
              <FiHome className="w-4 h-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-2 rounded-xl py-2 px-3 text-sm font-medium transition-all
              data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent
              data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-white hover:text-primary/90">
              <FiActivity className="w-4 h-4" /> Activities
            </TabsTrigger>
            <TabsTrigger value="learning" className="flex items-center gap-2 rounded-xl py-2 px-3 text-sm font-medium transition-all
              data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent
              data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-white hover:text-primary/90">
              <FiBook className="w-4 h-4" /> Learning
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2 rounded-xl py-2 px-3 text-sm font-medium transition-all
              data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent
              data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-white hover:text-primary/90">
              <FiAward className="w-4 h-4" /> Leaderboard
            </TabsTrigger>
          </TabsList>

          {/* ── OVERVIEW TAB ── */}
          <TabsContent value="overview" className="space-y-6">

            {/* Quick Actions */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
              <div className="flex space-x-4 overflow-x-auto py-2">

                {/* Generate QR Code */}
                <Card className="cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all flex-shrink-0 w-64"
                  onClick={handleGenerateQR}>
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                      <QrCode className="h-7 w-7" />
                    </div>
                    <h3 className="font-semibold">Generate QR Code</h3>
                    <p className="text-sm text-muted-foreground">
                      {isGeneratingQR ? "Generating..." : "Citizens scan to verify disposal"}
                    </p>
                  </CardContent>
                </Card>

                {/* Track Waste Truck — keeps your existing WasteTracking */}
                <Card className="cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all flex-shrink-0 w-64"
                  onClick={() => setShowWasteTracking(true)}>
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                      <Truck className="h-7 w-7" />
                    </div>
                    <h3 className="font-semibold">Track Waste Truck</h3>
                    <p className="text-sm text-muted-foreground">Locate collection vehicles</p>
                  </CardContent>
                </Card>

                {/* Schedule Pickup */}
                <Card className="cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all flex-shrink-0 w-64"
                  onClick={() => setShowSchedulePickup(true)}>
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                      <Calendar className="h-7 w-7" />
                    </div>
                    <h3 className="font-semibold">Schedule Pickup</h3>
                    <p className="text-sm text-muted-foreground">Manage pickup schedules</p>
                  </CardContent>
                </Card>

                {/* E-Waste Day */}
                <Card className="cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all flex-shrink-0 w-64"
                  onClick={() => setShowEWasteDay(true)}>
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                      <Calendar className="h-7 w-7" />
                    </div>
                    <h3 className="font-semibold">E-Waste Day</h3>
                    <p className="text-sm text-muted-foreground">Manage monthly E-Waste drive</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Generated QR Display */}
            {generatedQR && (
              <Card className="border-primary/30 bg-green-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <QrCode className="h-5 w-5" />
                    Your Active Verification QR
                  </CardTitle>
                  <CardDescription>
                    Citizens scan this to verify waste disposal → they get <strong>+25 pts</strong> → your garbage streak increases!
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row items-center gap-6">
                  <img src={generatedQR} alt="Employee QR Code" className="w-44 h-44 rounded-xl border-2 border-primary/20 shadow-md" />
                  <div className="space-y-3 flex-1">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="p-3 bg-white rounded-lg border">
                        <p className="text-muted-foreground text-xs">Employee</p>
                        <p className="font-semibold">{user?.displayName || "—"}</p>
                      </div>
                      <div className="p-3 bg-white rounded-lg border">
                        <p className="text-muted-foreground text-xs">Employee ID</p>
                        <p className="font-semibold">{userData?.employeeId || user?.uid?.slice(0, 8)}</p>
                      </div>
                      <div className="p-3 bg-white rounded-lg border">
                        <p className="text-muted-foreground text-xs">Scans Today</p>
                        <p className="font-semibold text-primary">{scansToday}</p>
                      </div>
                      <div className="p-3 bg-white rounded-lg border">
                        <p className="text-muted-foreground text-xs">Garbage Streak</p>
                        <p className="font-semibold text-orange-500">🔥 {streak} days</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleDownloadQR} variant="outline" className="flex items-center gap-2">
                        <Download className="h-4 w-4" /> Download
                      </Button>
                      <Button onClick={handleCitizenScanned} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" /> Simulate Citizen Scan
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      💡 "Simulate Citizen Scan" is for demo purposes — in production, citizens use the Swachh Buddy app to scan.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Citizen Pickup Requests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  Citizen Pickup Requests
                  <Badge variant="destructive" className="ml-2">
                    {pickupRequests.filter(r => r.status === "pending").length} Pending
                  </Badge>
                </CardTitle>
                <CardDescription>Pickup requests submitted by citizens in your zone</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pickupRequests.map((req) => (
                    <div key={req.id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        req.status === "completed"
                          ? "bg-green-50 border-green-200"
                          : "bg-orange-50 border-orange-200"
                      }`}>
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                        <div>
                          <div className="font-medium text-sm">{req.citizen}</div>
                          <div className="text-xs text-muted-foreground">{req.address}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{req.type}</Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {req.scheduledTime}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-xs font-semibold capitalize px-2 py-1 rounded-full ${
                          req.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}>
                          {req.status}
                        </span>
                        {req.status === "pending" && (
                          <Button size="sm" className="text-xs h-7" onClick={() => handleCompletePickup(req.id)}>
                            <CheckCircle className="h-3 w-3 mr-1" /> Mark Done (+30 pts)
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Points Legend + Weekly Progress */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>Points Legend</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/30 rounded-md">🔲 QR Scanned by Citizen — +10 pts</div>
                    <div className="p-3 bg-muted/30 rounded-md">📦 Pickup Completed — +30 pts</div>
                    <div className="p-3 bg-muted/30 rounded-md">🎓 Complete Training — +100 pts</div>
                    <div className="p-3 bg-muted/30 rounded-md">♻️ E-Waste Drive — +75 pts</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Progress</CardTitle>
                  <CardDescription>You're {weeklyGoal - weeklyProgress} points away from your goal!</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-2 font-medium">{weeklyProgress} / {weeklyGoal} pts</div>
                  <div className="h-3 bg-muted/20 rounded overflow-hidden">
                    <div style={{ width: `${Math.min(100, (weeklyProgress / weeklyGoal) * 100)}%` }}
                      className="h-full bg-primary transition-all duration-500" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    You're at {Math.round((weeklyProgress / weeklyGoal) * 100)}% this week. Keep going! 💪
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Achievements */}
            <Card>
              <CardHeader><CardTitle>Recent Achievements</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-success/10 rounded border border-success/20">✅ Joined as Municipal Employee (+10 pts)</div>
                  <div className="p-3 bg-success/10 rounded border border-success/20">✅ First QR Generated — Citizens verified (+10 pts)</div>
                  <div className="p-3 bg-success/10 rounded border border-success/20">✅ 3 Pickups Completed this week (+90 pts)</div>
                  <div className="p-3 bg-success/10 rounded border border-success/20">✅ 7-Day Garbage Streak — Outstanding! 🔥</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── ACTIVITIES TAB ── */}
          <TabsContent value="activities">
            <Activities />
          </TabsContent>

          {/* ── LEARNING TAB ── */}
          <TabsContent value="learning" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2">Employee Training Hub</h2>
              <p className="text-muted-foreground">Complete training modules and learn your duties as a municipal employee</p>
            </div>

            {/* Employee Duties Section — unique to employee dashboard */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <AlertTriangle className="h-5 w-5" />
                  Your Duties as a Municipal Employee
                </CardTitle>
                <CardDescription>Key responsibilities you must fulfil daily</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { icon: "🔲", duty: "Generate QR Code daily for citizen verification" },
                    { icon: "🚛", duty: "Ensure timely waste collection in your assigned zone" },
                    { icon: "📋", duty: "Review and complete citizen pickup requests" },
                    { icon: "♻️", duty: "Conduct weekly E-Waste collection drives" },
                    { icon: "📊", duty: "Submit daily waste collection reports" },
                    { icon: "🎓", duty: "Complete all mandatory training modules" },
                    { icon: "🗺️", duty: "Track and update waste truck locations" },
                    { icon: "📣", duty: "Educate citizens on proper waste segregation" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-primary/10">
                      <span className="text-xl">{item.icon}</span>
                      <p className="text-sm text-foreground">{item.duty}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Training Cards — same structure as citizen */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <GraduationCap className="mr-2 h-5 w-5" />
                    Core Training
                  </CardTitle>
                  <CardDescription>Complete the 3-level mandatory training program</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm"><span>Progress</span><span>2/3 levels</span></div>
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
                  <CardDescription>Play interactive games to reinforce knowledge</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm"><span>Games Played</span><span>12</span></div>
                    <div className="flex justify-between text-sm"><span>Points Earned</span><span>850 pts</span></div>
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/play">Play Games</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Employee Courses
                  </CardTitle>
                  <CardDescription>Role-specific training for municipal staff</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="secondary" className="w-full">
                    <Link to="/learning">Explore Courses</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Learning Progress */}
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

          {/* ── LEADERBOARD TAB ── */}
          <TabsContent value="leaderboard">
            <Card>
              <CardHeader><CardTitle>District Leaderboard</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboardData.map((u, idx) => (
                    <div key={idx}
                      className={`flex items-center justify-between p-3 rounded ${u.isUser ? "bg-primary/10 border border-primary/20" : "bg-muted/30"}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                          ${u.rank === 1 ? "bg-yellow-400 text-yellow-900" :
                            u.rank === 2 ? "bg-gray-300 text-gray-700" :
                            u.rank === 3 ? "bg-orange-400 text-orange-900" :
                            "bg-muted text-foreground"}`}>
                          {u.rank === 1 ? "🥇" : u.rank === 2 ? "🥈" : u.rank === 3 ? "🥉" : u.rank}
                        </div>
                        <div>
                          <div className="font-medium">{u.name} {u.isUser && <span className="text-primary text-xs">(You)</span>}</div>
                          <div className="text-sm text-muted-foreground">{u.district}</div>
                        </div>
                      </div>
                      <div className="font-bold text-primary">{u.points} pts</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals — WasteTracking keeps your existing map component */}
      <WasteTracking
        isOpen={showWasteTracking}
        onClose={() => setShowWasteTracking(false)}
      />
      <SchedulePickup
        isOpen={showSchedulePickup}
        onClose={() => setShowSchedulePickup(false)}
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

export default EDashboard;
