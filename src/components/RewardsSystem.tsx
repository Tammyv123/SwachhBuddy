import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Gift, 
  Star, 
  Target, 
  Award,
  Coins,
  ShoppingBag,
  Calendar,
  Home,
  CheckCircle,
  Lock,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RewardsSystemProps {
  userData?: any;
  currentPoints?: number;
  onBack?: () => void;
}

const RewardsSystem = ({ userData, currentPoints = 1250, onBack }: RewardsSystemProps) => {
  const [selectedReward, setSelectedReward] = useState<string | null>(null);
  const { toast } = useToast();

  const rewardHistory = [
    { type: "QR Scan", points: 25, date: "2024-01-10", description: "Scanned waste bin verification" },
    { type: "Training Completion", points: 100, date: "2024-01-08", description: "Completed Waste Basics Module" },
    { type: "Community Event", points: 150, date: "2024-01-05", description: "Participated in cleanup drive" },
    { type: "Report Submission", points: 50, date: "2024-01-03", description: "Reported waste management issue" }
  ];

  const redeemableRewards = [
    {
      id: "mobile-recharge",
      title: "Mobile Recharge",
      description: "₹50 Mobile Recharge Voucher",
      points: 500,
      category: "vouchers",
      available: true,
      image: "📱"
    },
    {
      id: "shopping-voucher",
      title: "Shopping Voucher",
      description: "₹100 Shopping Voucher",
      points: 1000,
      category: "vouchers",
      available: true,
      image: "🛒"
    },
    {
      id: "tree-plantation",
      title: "Tree Plantation Certificate",
      description: "Plant a tree in your name",
      points: 750,
      category: "environment",
      available: true,
      image: "🌱"
    },
    {
      id: "eco-bag",
      title: "Eco-Friendly Bag",
      description: "Reusable jute shopping bag",
      points: 300,
      category: "merchandise",
      available: true,
      image: "👜"
    },
    {
      id: "compost-kit",
      title: "Home Composting Kit",
      description: "Complete home composting setup",
      points: 1500,
      category: "merchandise",
      available: currentPoints >= 1500,
      image: "🪴"
    },
    {
      id: "solar-light",
      title: "Solar LED Light",
      description: "Portable solar-powered LED light",
      points: 2000,
      category: "merchandise",
      available: currentPoints >= 2000,
      image: "💡"
    }
  ];

  const achievements = [
    { 
      title: "First Steps", 
      description: "Completed training", 
      icon: <CheckCircle className="h-5 w-5" />, 
      earned: true,
      points: 100,
      date: "2024-01-15"
    },
    { 
      title: "Week Warrior", 
      description: "7-day streak", 
      icon: <Zap className="h-5 w-5" />, 
      earned: true,
      points: 150,
      date: "2024-01-22"
    },
    { 
      title: "QR Master", 
      description: "Scan 50 QR codes", 
      icon: <Target className="h-5 w-5" />, 
      earned: false,
      points: 250,
      progress: 50
    },
    { 
      title: "Eco Champion", 
      description: "Reach 5000 points", 
      icon: <Trophy className="h-5 w-5" />, 
      earned: false,
      points: 500,
      progress: 25
    }
  ];

  const handleRedeem = (rewardId: string) => {
    const reward = redeemableRewards.find(r => r.id === rewardId);
    if (reward && currentPoints >= reward.points) {
      toast({
        title: "Reward Redeemed! 🎉",
        description: `You've successfully redeemed ${reward.title}. Check your email for details.`,
      });
    } else {
      toast({
        title: "Insufficient Points",
        description: "You don't have enough points to redeem this reward.",
        variant: "destructive"
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "vouchers": return "💳";
      case "environment": return "🌍";
      case "merchandise": return "🎁";
      default: return "⭐";
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Rewards & Achievements</h1>
            <p className="text-muted-foreground">Earn points and redeem exciting rewards</p>
          </div>
          {onBack && (
            <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Back to Dashboard
            </Button>
          )}
        </div>

        {/* Points Overview */}
        <Card className="mb-8 bg-gradient-to-r from-primary/10 to-accent/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-primary/20 rounded-full">
                  <Coins className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{currentPoints.toLocaleString()} Points</h2>
                  <p className="text-muted-foreground">Your current balance</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-success">+{rewardHistory[0]?.points || 0}</div>
                <div className="text-sm text-muted-foreground">Earned today</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="rewards" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rewards">Redeem Rewards</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="history">Points History</TabsTrigger>
          </TabsList>

          <TabsContent value="rewards" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {redeemableRewards.map((reward) => (
                <Card 
                  key={reward.id} 
                  className={`relative transition-all duration-300 hover:shadow-lg ${
                    !reward.available ? 'opacity-60' : 'hover:scale-105'
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="text-3xl mb-2">{reward.image}</div>
                      <Badge variant="outline" className="text-xs">
                        {getCategoryIcon(reward.category)} {reward.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{reward.title}</CardTitle>
                    <CardDescription>{reward.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Coins className="h-4 w-4 text-primary" />
                          <span className="font-semibold">{reward.points} points</span>
                        </div>
                        {!reward.available && (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      
                      <Button 
                        onClick={() => handleRedeem(reward.id)}
                        disabled={!reward.available}
                        className="w-full"
                        variant={reward.available ? "default" : "outline"}
                      >
                        {reward.available ? (
                          <>
                            <Gift className="mr-2 h-4 w-4" />
                            Redeem Now
                          </>
                        ) : (
                          <>
                            <Lock className="mr-2 h-4 w-4" />
                            Not Enough Points
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <Card key={index} className={`${achievement.earned ? 'bg-success/5 border-success/20' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full ${
                        achievement.earned ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'
                      }`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{achievement.title}</h3>
                          <div className="flex items-center gap-1">
                            <Coins className="h-3 w-3 text-primary" />
                            <span className="text-sm font-medium">{achievement.points}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                        
                        {achievement.earned ? (
                          <div className="flex items-center gap-2 text-success">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm">Earned on {achievement.date}</span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{achievement.progress || 0}%</span>
                            </div>
                            <Progress value={achievement.progress || 0} className="h-2" />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Points Activity</CardTitle>
                <CardDescription>Your points earning history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rewardHistory.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <Star className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{activity.type}</p>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-success">+{activity.points}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(activity.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RewardsSystem;