import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  CheckCircle, 
  Play, 
  FileText, 
  Video, 
  Award,
  ArrowRight,
  ArrowLeft,
  Home
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import basicsVideo from '@/assets/basics.mp4';

export const WasteBasicsModule = () => {
  const navigate = useNavigate();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<{[key: number]: number}>({});
  const [introWatched, setIntroWatched] = useState(false);

  // Restore from localStorage
  useEffect(() => {
    const savedCompleted = localStorage.getItem('completedLessons');
    if (savedCompleted) setCompletedLessons(JSON.parse(savedCompleted));

    const savedQuiz = localStorage.getItem('quizAnswers');
    if (savedQuiz) setQuizAnswers(JSON.parse(savedQuiz));

    const savedIntro = localStorage.getItem('introWatched');
    if (savedIntro) setIntroWatched(JSON.parse(savedIntro));
  }, []);

  // Save progress
  useEffect(() => {
    localStorage.setItem('completedLessons', JSON.stringify(completedLessons));
  }, [completedLessons]);

  useEffect(() => {
    localStorage.setItem('quizAnswers', JSON.stringify(quizAnswers));
  }, [quizAnswers]);

  useEffect(() => {
    localStorage.setItem('introWatched', JSON.stringify(introWatched));
  }, [introWatched]);

  // Restart Course
  const handleRestartCourse = () => {
    setCompletedLessons([]);
    setQuizAnswers({});
    setIntroWatched(false);
    setCurrentLesson(0);

    localStorage.removeItem("completedLessons");
    localStorage.removeItem("quizAnswers");
    localStorage.removeItem("introWatched");

    toast.success("Course restarted! 🎉");
  };

  const lessons = [
    {
      id: 0,
      title: "What is Waste?",
      duration: "10 min",
      type: "reading",
      content: {
        introduction: "Waste is any material that is discarded after primary use, or is worthless, defective and of no use. In India, we generate approximately 62 million tonnes of waste annually.",
        keyPoints: [
          "Sources: households, industries, commercial spaces, institutions",
          "India generates ~1.7 lakh tonnes of solid waste daily",
          "Only 54% of waste is scientifically treated",
          "Improper waste management causes health hazards and pollution",
          "Rapid urbanization increases plastic and e-waste generation"
        ],
        detailedContent: `
Waste management is a critical challenge due to increasing population and urban growth. Types of waste include:
• Household: kitchen scraps, old clothes, packaging, leftover food
• Commercial: offices, restaurants, shops, markets
• Industrial: manufacturing byproducts, chemicals, metals, plastics
• Construction & demolition: bricks, concrete, debris, wood
• E-waste: electronics, batteries, circuits, mobile phones

Environmental Impact:
- Soil contamination due to hazardous chemicals and heavy metals
- Water pollution from untreated liquid waste and dumping
- Air pollution from open burning of plastics and garbage
- Methane emission from landfills contributing to greenhouse gases
- Biodiversity loss, affecting flora and fauna

Best Practices:
- Segregation at source (wet, dry, hazardous)
- Recycling plastics, metals, paper, and glass
- Composting organic waste to produce manure
- Energy recovery from waste (biogas, incineration with emission control)
- Community awareness and participation
        `,
        quiz: {
          question: "How much solid waste does India generate daily?",
          options: ["1.2 lakh tonnes", "1.7 lakh tonnes", "2.1 lakh tonnes", "2.5 lakh tonnes"],
          correct: 1
        }
      }
    },
    {
      id: 1,
      title: "The 3 R's: Reduce, Reuse, Recycle",
      duration: "15 min",
      type: "interactive",
      content: {
        introduction: "The 3 R's are the foundation of waste management: Reduce, Reuse, Recycle. These principles help minimize waste and conserve resources.",
        principles: [
          {
            title: "REDUCE",
            description: "Minimize waste generation at the source by conscious consumption.",
            examples: [
              "Use digital receipts instead of paper",
              "Choose products with minimal packaging",
              "Buy only what you need",
              "Use refillable water bottles"
            ],
            impact: "Can reduce household waste by up to 30%"
          },
          {
            title: "REUSE",
            description: "Find new purposes for items before discarding them.",
            examples: [
              "Use glass jars for storage",
              "Convert old clothes into cleaning rags",
              "Repurpose cardboard boxes for storage",
              "Donate items in good condition to charity"
            ],
            impact: "Extends product lifespan by 50-80%"
          },
          {
            title: "RECYCLE",
            description: "Process materials to create new products, reducing the need for raw materials.",
            examples: [
              "Separate paper, plastic, glass, and metal for recycling",
              "Compost organic waste",
              "Recycle electronic devices properly",
              "Use recycled products when possible"
            ],
            impact: "Saves 60-70% energy compared to producing from raw materials"
          }
        ],
        detailedContent: `
Importance of 3 R's:
- Reduces landfill usage
- Conserves natural resources
- Decreases pollution
- Saves energy
- Encourages sustainable lifestyle

Implementation Tips:
- Always segregate waste at home
- Prefer products with eco-labels
- Encourage community recycling drives
- Educate children about waste reduction
- Track household waste and try to reduce it every month
        `,
        quiz: {
          question: "Which R should be the first priority?",
          options: ["Recycle", "Reuse", "Reduce", "All are equal"],
          correct: 2
        }
      }
    },
    {
      id: 2,
      title: "Waste Segregation - The Indian Way",
      duration: "20 min",
      type: "video",
      content: {
        introduction: "India follows a color-coded system for waste segregation. Proper segregation is essential for recycling and composting.",
        videoUrl: "/videos/waste-segregation-india.mp4",
        categories: [
          {
            color: "Green",
            type: "Wet Waste",
            description: "Organic, decomposable waste",
            examples: ["Fruit peels", "Cooked leftovers", "Garden waste", "Tea leaves"],
            treatment: "Composting/biogas",
            percentage: "50-60%"
          },
          {
            color: "Blue",
            type: "Dry Waste",
            description: "Recyclable materials",
            examples: ["Paper", "Plastic", "Glass", "Metal", "Cardboard"],
            treatment: "Recycling facilities",
            percentage: "30-40%"
          },
          {
            color: "Red",
            type: "Hazardous Waste",
            description: "Special handling required",
            examples: ["Batteries", "Medical waste", "Chemicals", "Paint containers"],
            treatment: "Special disposal",
            percentage: "5-10%"
          }
        ],
        detailedContent: `
Segregation Benefits:
- Prevents contamination of recyclables
- Reduces waste sent to landfills
- Facilitates composting of organic waste
- Ensures hazardous waste is treated safely
- Improves efficiency of municipal waste management

Tips for Households:
- Use separate bins for wet, dry, and hazardous waste
- Label bins clearly
- Educate family members about segregation
- Dispose of e-waste at collection centers
- Compost kitchen and garden waste regularly
        `,
        quiz: {
          question: "Coconut shells go into which bin?",
          options: ["Green", "Blue", "Red", "Any bin"],
          correct: 0
        }
      }
    }
  ];

  const handleCompleteLesson = (lessonId: number) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
      toast.success(`Lesson "${lessons[lessonId].title}" completed!`);
    }
  };

  const handleQuizAnswer = (lessonId: number, answerIndex: number) => {
    setQuizAnswers({...quizAnswers, [lessonId]: answerIndex});
    const lesson = lessons[lessonId];
    if (answerIndex === lesson.content.quiz.correct) {
      toast.success("Correct!");
      handleCompleteLesson(lessonId);
    } else {
      toast.error("Incorrect, try again!");
    }
  };

  const progressPercentage = (completedLessons.length / lessons.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">Waste Management Basics</h1>
            <p className="text-muted-foreground">Learn the fundamentals of waste management</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/')} className="flex items-center gap-2">
            <Home className="h-4 w-4"/> Home
          </Button>
        </div>

        {/* Intro Video */}
        {!introWatched && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Introduction Video</CardTitle>
            </CardHeader>
            <CardContent>
              <video 
                src={basicsVideo} 
                controls 
                className="w-full rounded-lg"
                onEnded={() => setIntroWatched(true)}
              />
              <p className="mt-2 text-muted-foreground">Watch this video to start your journey!</p>
            </CardContent>
          </Card>
        )}

        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium">Course Progress</span>
              <Badge variant="secondary">{completedLessons.length}/{lessons.length}</Badge>
            </div>
            <Progress value={progressPercentage} className="w-full mb-4" />

            {/* Restart Course Button */}
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleRestartCourse}
              className="mt-2"
            >
              Restart Course
            </Button>
          </CardContent>
        </Card>

        {/* Lessons List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {lessons.map((lesson, index) => (
            <Card key={lesson.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                currentLesson === index ? 'ring-2 ring-primary' : ''
              } ${completedLessons.includes(index) ? 'bg-success/10 border-success' : ''}`}
              onClick={() => introWatched ? setCurrentLesson(index) : toast.error("Watch the intro video first!")}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <Badge variant={lesson.type === 'video' ? 'default' : 'secondary'}>
                    {lesson.type === 'video' ? <Video className="h-3 w-3 mr-1"/> : lesson.type === 'interactive' ? <Play className="h-3 w-3 mr-1"/> : <FileText className="h-3 w-3 mr-1"/>}
                    {lesson.type}
                  </Badge>
                  {completedLessons.includes(index) && <CheckCircle className="h-5 w-5 text-success" />}
                </div>
                <CardTitle className="text-lg">{lesson.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{lesson.duration}</p>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Current Lesson */}
        {introWatched && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5"/>{lessons[currentLesson].title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="content">Lesson Content</TabsTrigger>
                  <TabsTrigger value="quiz" disabled={!completedLessons.includes(currentLesson)}>Quiz</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-6">
                  <p className="text-lg">{lessons[currentLesson].content.introduction}</p>
                  {lessons[currentLesson].content.keyPoints && (
                    <ul className="list-disc ml-5 space-y-1">
                      {lessons[currentLesson].content.keyPoints.map((point, i) => <li key={i}>{point}</li>)}
                    </ul>
                  )}
                  {lessons[currentLesson].content.principles && (
                    <div className="space-y-4">
                      {lessons[currentLesson].content.principles.map((principle, idx) => (
                        <div key={idx} className="border rounded-lg p-4">
                          <h4 className="font-semibold text-primary mb-1">{principle.title}</h4>
                          <p className="text-muted-foreground mb-2">{principle.description}</p>
                          <ul className="list-disc ml-5 mb-2">
                            {principle.examples.map((ex, i) => <li key={i}>{ex}</li>)}
                          </ul>
                          <p className="font-medium">Impact: {principle.impact}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {lessons[currentLesson].content.categories && (
                    <div className="space-y-4">
                      {lessons[currentLesson].content.categories.map((cat, idx) => (
                        <div key={idx} className="border rounded-lg p-4">
                          <h4 className="font-semibold text-primary mb-1">{cat.type} ({cat.color} bin)</h4>
                          <p className="text-muted-foreground mb-1">{cat.description}</p>
                          <p className="mb-1">Examples: {cat.examples.join(", ")}</p>
                          <p>Treatment: {cat.treatment}</p>
                          <p>Percentage: {cat.percentage}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {lessons[currentLesson].content.detailedContent && (
                    <div className="whitespace-pre-line text-base leading-relaxed mt-4">
                      {lessons[currentLesson].content.detailedContent}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="quiz" className="space-y-4">
                  <div className="space-y-2">
                    <p className="font-medium">{lessons[currentLesson].content.quiz.question}</p>
                    {lessons[currentLesson].content.quiz.options.map((option, index) => (
                      <Button key={index} 
                        variant={quizAnswers[currentLesson] === index ? (index === lessons[currentLesson].content.quiz.correct ? "default":"destructive") : "outline"}
                        className="w-full text-left"
                        onClick={() => handleQuizAnswer(currentLesson, index)}>
                        {option}
                      </Button>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Navigation */}
              <div className="flex justify-between mt-6 pt-6 border-t">
                <Button variant="outline" onClick={() => setCurrentLesson(Math.max(0, currentLesson -1))} disabled={currentLesson===0}><ArrowLeft className="h-4 w-4 mr-2"/>Previous</Button>
                <Button onClick={() => handleCompleteLesson(currentLesson)} disabled={completedLessons.includes(currentLesson)}>
                  {completedLessons.includes(currentLesson) ? <><CheckCircle className="h-4 w-4 mr-2"/>Completed</> : <><Award className="h-4 w-4 mr-2"/>Mark Complete</>}
                </Button>
                <Button variant="outline" onClick={() => completedLessons.includes(currentLesson) ? setCurrentLesson(Math.min(lessons.length-1, currentLesson+1)) : toast.error("Complete lesson & quiz first!")} disabled={currentLesson===lessons.length-1}>Next<ArrowRight className="h-4 w-4 ml-2"/></Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
