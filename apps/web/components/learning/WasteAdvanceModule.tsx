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
import advancedIntroVideo from '@/assets/advancedIntro.mp4';

export const WasteAdvancedModule = () => {
  const navigate = useNavigate();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<{[key: number]: number}>({});
  const [introWatched, setIntroWatched] = useState(false);

  useEffect(() => {
    const savedCompleted = localStorage.getItem('advancedCompletedLessons');
    if (savedCompleted) setCompletedLessons(JSON.parse(savedCompleted));

    const savedQuiz = localStorage.getItem('advancedQuizAnswers');
    if (savedQuiz) setQuizAnswers(JSON.parse(savedQuiz));

    const savedIntro = localStorage.getItem('advancedIntroWatched');
    if (savedIntro) setIntroWatched(JSON.parse(savedIntro));
  }, []);

  useEffect(() => {
    localStorage.setItem('advancedCompletedLessons', JSON.stringify(completedLessons));
  }, [completedLessons]);

  useEffect(() => {
    localStorage.setItem('advancedQuizAnswers', JSON.stringify(quizAnswers));
  }, [quizAnswers]);

  useEffect(() => {
    localStorage.setItem('advancedIntroWatched', JSON.stringify(introWatched));
  }, [introWatched]);

  const lessons = [
    {
      id: 0,
      title: "Advanced Color Coding Systems",
      duration: "20 min",
      type: "video",
      content: {
        introduction: "Explore advanced waste color coding and segregation techniques beyond standard norms.",
        videoUrl: "/videos/advanced-color-coding.mp4",
        quiz: {
          question: "Which color bin is for hazardous electronic waste?",
          options: ["Red", "Blue", "Green", "Yellow"],
          correct: 0
        }
      }
    },
    {
      id: 1,
      title: "Wet Waste Processing Methods",
      duration: "15 min",
      type: "interactive",
      content: {
        introduction: "Learn advanced techniques for wet waste treatment including biogas generation and composting.",
        principles: [
          { title: "Anaerobic Digestion", description: "Breakdown of organic matter in absence of oxygen to generate biogas.", examples: ["Kitchen waste", "Garden waste"], impact: "Reduces landfill load & produces energy" },
          { title: "Vermicomposting", description: "Use of worms to convert organic waste into nutrient-rich compost.", examples: ["Vegetable scraps", "Fruit peels"], impact: "Produces high-quality fertilizer" }
        ],
        quiz: {
          question: "Which method produces biogas?",
          options: ["Vermicomposting", "Anaerobic Digestionn", "Open dumping", "Incineration"],
          correct: 1
        }
      }
    },
    {
      id: 2,
      title: "Dry Waste Identification",
      duration: "20 min",
      type: "reading",
      content: {
        introduction: "Identify recyclable materials and non-biodegradable waste efficiently.",
        keyPoints: [
          "Paper, cardboard, plastics, metals, glass are dry waste",
          "Segregate at source to improve recycling efficiency",
          "Avoid contamination with wet waste"
        ],
        quiz: {
          question: "Which of these is dry waste?",
          options: ["Vegetable peels", "Plastic bottles", "Leftover rice", "Grass clippings"],
          correct: 1
        }
      }
    },
    {
      id: 3,
      title: "Hazardous & E-Waste Handling",
      duration: "15 min",
      type: "video",
      content: {
        introduction: "Proper disposal of hazardous and electronic waste.",
        videoUrl: "/videos/hazardous-ewaste.mp4",
        quiz: {
          question: "Batteries belong to which category?",
          options: ["Wet Waste", "Dry Waste", "Hazardous Waste", "Compostable Waste"],
          correct: 2
        }
      }
    },
    {
      id: 4,
      title: "Community & Industrial Waste Management",
      duration: "20 min",
      type: "reading",
      content: {
        introduction: "Advanced strategies for managing waste at community and industrial levels.",
        keyPoints: [
          "Segregation at source for communities",
          "Industrial byproducts management",
          "Collaboration with municipal authorities"
        ],
        quiz: {
          question: "Which practice reduces landfill burden?",
          options: ["Open dumping", "Segregation & recycling", "Burning waste", "Illegal disposal"],
          correct: 1
        }
      }
    },
    {
      id: 5,
      title: "Waste-to-Energy & Sustainability",
      duration: "15 min",
      type: "interactive",
      content: {
        introduction: "Learn cutting-edge techniques to convert waste into energy sustainably.",
        principles: [
          { title: "Incineration with Energy Recovery", description: "Burn waste to generate heat or electricity.", examples: ["Municipal solid waste"], impact: "Reduces landfill and generates energy" },
          { title: "Landfill Gas Capture", description: "Capture methane from landfills to produce energy.", examples: ["Organic waste landfills"], impact: "Reduces greenhouse gas emissions" }
        ],
        quiz: {
          question: "What energy can be obtained from landfill gas?",
          options: ["Electricity", "Solar energy", "Wind energy", "None"],
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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">Advanced Waste Management</h1>
            <p className="text-muted-foreground">1.5 hours • 8,900 enrolled • Certificate on completion</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/')} className="flex items-center gap-2">
            <Home className="h-4 w-4"/> Home
          </Button>
        </div>

        {!introWatched && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Introduction Video</CardTitle>
            </CardHeader>
            <CardContent>
              <video 
                src={advancedIntroVideo} 
                controls 
                className="w-full rounded-lg"
                onEnded={() => setIntroWatched(true)}
              />
              <p className="mt-2 text-muted-foreground">Watch this video to start your advanced course!</p>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium">Course Progress</span>
              <Badge variant="secondary">{completedLessons.length}/{lessons.length}</Badge>
            </div>
            <Progress value={progressPercentage} className="w-full" />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {lessons.map((lesson, index) => (
            <Card key={lesson.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg 
                ${currentLesson === index ? 'ring-2 ring-primary' : ''} 
                ${completedLessons.includes(index) ? 'bg-success/10 border-success' : ''}`}
              onClick={() => introWatched ? setCurrentLesson(index) : toast.error("Watch the intro video first!")}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <Badge variant={lesson.type === 'video' ? 'default' : lesson.type === 'interactive' ? 'secondary' : 'secondary'}>
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
                  {lessons[currentLesson].content.videoUrl && (
                    <video src={lessons[currentLesson].content.videoUrl} controls className="w-full rounded-lg mt-4" />
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
