import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Book, 
  Users, 
  GraduationCap, 
  Recycle, 
  Play, 
  Clock, 
  Award,
  Target,
  CheckCircle,
  Star,
  ArrowRight,
  Gamepad2,
  Home
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import LearningGames from "@/components/LearningGames";

const Learning = () => {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const { toast } = useToast();

  // Core training levels with real content
  const trainingLevels = [
    {
      id: 1,
      title: "Waste Management Basics",
      description: "Understanding the fundamentals of waste management, types of waste, and the 3 R's principle",
      modules: 8,
      duration: "2 hours",
      difficulty: "Beginner",
      completed: false,
      rating: 4.8,
      enrolled: 12500,
      content: [
        "What is Waste? - Types and Sources",
        "The 3 R's: Reduce, Reuse, Recycle", 
        "Waste Segregation - Color Coding System",
        "Composting Basics",
        "Plastic Waste Management",
        "E-waste Handling",
        "Hazardous Waste Safety",
        "Community Participation"
      ],
      quiz: {
        questions: 25,
        passingScore: 80,
        attempts: 3
      },
      certificate: true,
      route: "/learning/waste-basics",
      completionRate: 0
    },
    {
      id: 2,
      title: "Advanced Segregation Techniques",
      description: "Master the art of proper waste separation with hands-on training and real-world scenarios",
      modules: 6,
      duration: "1.5 hours", 
      difficulty: "Intermediate",
      completed: false,
      rating: 4.7,
      enrolled: 8900,
      content: [
        "Advanced Color Coding Systems",
        "Wet Waste Processing Methods",
        "Dry Waste Identification",
        "Hazardous Material Recognition",
        "Industrial Waste Categories",
        "Medical Waste Protocols"
      ],
      quiz: {
        questions: 20,
        passingScore: 85,
        attempts: 3
      },
      certificate: true,
      route: "/learning/advanced-segregation",
      completionRate: 0
    },
    {
      id: 3,
      title: "Waste Processing & Recycling",
      description: "Learn about waste processing facilities, recycling methods, and circular economy principles",
      modules: 10,
      duration: "3 hours",
      difficulty: "Advanced", 
      completed: false,
      rating: 4.9,
      enrolled: 5600,
      content: [
        "Waste Treatment Technologies",
        "Recycling Industry Overview",
        "Material Recovery Facilities",
        "Composting Plant Operations",
        "Waste-to-Energy Systems",
        "Circular Economy Principles",
        "Supply Chain Management",
        "Quality Control in Recycling",
        "Environmental Impact Assessment",
        "Policy and Regulations"
      ],
      quiz: {
        questions: 30,
        passingScore: 90,
        attempts: 2
      },
      certificate: true,
      route: "/learning/waste-processing",
      completionRate: 0
    }
  ];

  // Specialized courses for different user types
  const specializedCourses = {
    ragpickers: [
      {
        id: "rp-1",
        title: "Safety First: Personal Protection",
        description: "Essential safety protocols and protective equipment usage",
        duration: "1.5 hours",
        modules: 3,
        level: "Essential",
        rating: 4.8,
        students: 1200
      },
      {
        id: "rp-2", 
        title: "Efficient Collection Techniques",
        description: "Optimize your collection routes and sorting methods",
        duration: "2 hours",
        modules: 4,
        level: "Intermediate",
        rating: 4.7,
        students: 890
      },
      {
        id: "rp-3",
        title: "Digital Tools & Income Tracking",
        description: "Use mobile apps to track earnings and connect with buyers",
        duration: "1 hour",
        modules: 2,
        level: "Beginner", 
        rating: 4.9,
        students: 650
      }
    ],
    students: [
      {
        id: "st-1",
        title: "Campus Sustainability Champion",
        description: "Lead waste reduction initiatives in your school/college",
        duration: "3 hours",
        modules: 6,
        level: "Intermediate",
        rating: 4.6,
        students: 2100
      },
      {
        id: "st-2",
        title: "Environmental Science & Waste",
        description: "Scientific understanding of waste impact on ecosystems",
        duration: "4 hours",
        modules: 8,
        level: "Advanced",
        rating: 4.8,
        students: 1500
      },
      {
        id: "st-3",
        title: "Project Planning for Clean Drives",
        description: "Organize and execute successful clean-up campaigns",
        duration: "2 hours",
        modules: 4,
        level: "Beginner",
        rating: 4.5,
        students: 980
      }
    ],
    communities: [
      {
        id: "cm-1",
        title: "Community Mobilization",
        description: "Engage neighbors and local groups in waste management",
        duration: "2.5 hours",
        modules: 5,
        level: "Intermediate",
        rating: 4.7,
        students: 750
      },
      {
        id: "cm-2",
        title: "Local Policy & Advocacy",
        description: "Work with local authorities for better waste systems",
        duration: "3 hours",
        modules: 6,
        level: "Advanced", 
        rating: 4.6,
        students: 420
      }
    ]
  };

  const handleStartTraining = (levelId: number, route?: string) => {
  if (route) {
    navigate(route);
  } else {
    toast({
      title: "Starting Training Level",
      description: `Redirecting to Level ${levelId} training module...`,
    });
  }
};


  const handleStartCourse = (courseId: string) => {
    setSelectedCourse(courseId);
    toast({
      title: "Course Starting Soon",
      description: "Preparing your personalized learning experience...",
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": case "Essential": return "bg-green-500";
      case "Intermediate": return "bg-yellow-500";
      case "Advanced": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1"></div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-full">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold">Learning Hub</h1>
            </div>
            <div className="flex-1 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
            </div>
          </div>
          <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto">
            Comprehensive waste management education for everyone - from basic training to specialized courses
          </p>
        </div>

        <Tabs defaultValue="core-training" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="core-training">Core Training</TabsTrigger>
            <TabsTrigger value="rag-pickers">Rag Pickers</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="communities">Communities</TabsTrigger>
            <TabsTrigger value="games">Games</TabsTrigger>
          </TabsList>

          {/* Core Training Levels */}
          <TabsContent value="core-training" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2">Mandatory Training Levels</h2>
              <p className="text-muted-foreground">
                Complete all 3 levels to get certified and access advanced features
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {trainingLevels.map((level) => (
                <Card key={level.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className={getDifficultyColor(level.difficulty)}>
                        {level.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{level.rating}</span>
                      </div>
                    </div>
                    
                    <CardTitle className="text-xl">{level.title}</CardTitle>
                    <CardDescription>{level.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Book className="h-4 w-4" />
                          <span>{level.modules} modules</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{level.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{level.enrolled.toLocaleString()} enrolled</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          <span>Certificate</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Course Content:</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {level.content.slice(0, 3).map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-success" />
                              <span>{item}</span>
                            </div>
                          ))}
                          {level.content.length > 3 && (
                            <div className="text-xs text-muted-foreground ml-5">
                              +{level.content.length - 3} more modules
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{level.completionRate}%</span>
                        </div>
                        <Progress value={level.completionRate} className="h-2" />
                      </div>

                      <Button 
                        onClick={() => handleStartTraining(level.id, level.route)}
                        className="w-full"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Start Training
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Rag Pickers Courses */}
          <TabsContent value="rag-pickers" className="space-y-6">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Recycle className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-semibold">Courses for Rag Pickers</h2>
              </div>
              <p className="text-muted-foreground">
                Specialized training to improve safety, efficiency, and income
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {specializedCourses.ragpickers.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{course.level}</Badge>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{course.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{course.students}</span>
                        </div>
                      </div>

                      <Button 
                        onClick={() => handleStartCourse(course.id)}
                        className="w-full"
                      >
                        Start Course
                        <Play className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Students Courses */}
          <TabsContent value="students" className="space-y-6">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <GraduationCap className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-semibold">Courses for Students</h2>
              </div>
              <p className="text-muted-foreground">
                Educational content for schools, colleges, and young changemakers
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {specializedCourses.students.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{course.level}</Badge>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{course.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{course.students}</span>
                        </div>
                      </div>

                      <Button 
                        onClick={() => handleStartCourse(course.id)}
                        className="w-full"
                      >
                        Start Course
                        <Play className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Communities Courses */}
          <TabsContent value="communities" className="space-y-6">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Users className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-semibold">Community Leadership</h2>
              </div>
              <p className="text-muted-foreground">
                Build skills to lead waste management initiatives in your community
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {specializedCourses.communities.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{course.level}</Badge>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{course.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{course.students}</span>
                        </div>
                      </div>

                      <Button 
                        onClick={() => handleStartCourse(course.id)}
                        className="w-full"
                      >
                        Start Course
                        <Play className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Learning Games */}
          <TabsContent value="games" className="space-y-6">
            <LearningGames />
          </TabsContent>
        </Tabs>

        {/* Achievement Section */}
        <Card className="mt-8 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Earn Certificates</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete courses and get recognized for your contribution to sustainable India
                  </p>
                </div>
              </div>
              <Button variant="outline">
                View Achievements
                <Target className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Learning;