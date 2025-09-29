'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { BookOpen, Play, CheckCircle, Clock, Users, Star, Award, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function LearningPage() {
  const modules = [
    {
      id: 'waste-basics',
      title: 'Waste Management Basics',
      description: 'Learn the fundamentals of waste segregation and management',
      duration: '15 min',
      lessons: 5,
      progress: 100,
      difficulty: 'Beginner',
      points: 200,
      completed: true,
      category: 'Fundamentals',
    },
    {
      id: 'waste-advanced',
      title: 'Advanced Waste Processing',
      description: 'Deep dive into modern waste processing techniques',
      duration: '25 min',
      lessons: 8,
      progress: 60,
      difficulty: 'Intermediate',
      points: 350,
      completed: false,
      category: 'Advanced',
    },
    {
      id: 'composting',
      title: 'Home Composting Guide',
      description: 'Turn your organic waste into nutrient-rich compost',
      duration: '20 min',
      lessons: 6,
      progress: 0,
      difficulty: 'Beginner',
      points: 250,
      completed: false,
      category: 'Practical',
    },
    {
      id: 'recycling-tech',
      title: 'Recycling Technologies',
      description: 'Explore cutting-edge recycling and upcycling methods',
      duration: '30 min',
      lessons: 10,
      progress: 0,
      difficulty: 'Advanced',
      points: 400,
      completed: false,
      category: 'Technology',
    },
    {
      id: 'policy-awareness',
      title: 'Environmental Policies',
      description: 'Understanding government policies and regulations',
      duration: '18 min',
      lessons: 7,
      progress: 0,
      difficulty: 'Intermediate',
      points: 300,
      completed: false,
      category: 'Policy',
    },
    {
      id: 'community-action',
      title: 'Community Mobilization',
      description: 'How to organize and lead environmental initiatives',
      duration: '22 min',
      lessons: 9,
      progress: 0,
      difficulty: 'Intermediate',
      points: 320,
      completed: false,
      category: 'Leadership',
    },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800'
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'Advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-green-500'
    if (progress > 0) return 'bg-blue-500'
    return 'bg-gray-300'
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-blue-50'>
      {/* Header */}
      <header className='bg-white shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-4'>
            <div className='flex items-center space-x-4'>
              <Link href='/'>
                <h1 className='text-2xl font-bold text-green-600'>SwachhBuddy</h1>
              </Link>
              <nav className='hidden md:flex space-x-6'>
                <Link href='/play' className='text-gray-700 hover:text-green-600'>
                  Play
                </Link>
                <Link href='/earn' className='text-gray-700 hover:text-green-600'>
                  Earn
                </Link>
                <Link href='/resolve' className='text-gray-700 hover:text-green-600'>
                  Resolve
                </Link>
                <Link href='/learning' className='text-green-600 font-medium'>
                  Learning
                </Link>
              </nav>
            </div>
            <div className='flex items-center space-x-4'>
              <Link href='/login'>
                <Button variant='ghost'>Sign In</Button>
              </Link>
              <Link href='/register'>
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {/* Hero Section */}
        <div className='text-center mb-12'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className='text-4xl md:text-6xl font-bold text-gray-900 mb-4'>Learning Hub 📚</h1>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto mb-8'>
              Master the art of waste management through comprehensive modules, interactive content,
              and practical guides.
            </p>
            <div className='flex justify-center space-x-4'>
              <Badge variant='secondary' className='text-lg px-4 py-2'>
                <BookOpen className='w-4 h-4 mr-2' />6 Modules Available
              </Badge>
              <Badge variant='secondary' className='text-lg px-4 py-2'>
                <Users className='w-4 h-4 mr-2' />
                3.1k Learners
              </Badge>
            </div>
          </motion.div>
        </div>

        {/* Progress Overview */}
        <Card className='mb-12'>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Award className='w-5 h-5 mr-2 text-yellow-500' />
              Your Learning Progress
            </CardTitle>
            <CardDescription>Track your journey through environmental education</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
              <div className='text-center'>
                <div className='text-3xl font-bold text-green-600'>1</div>
                <p className='text-sm text-gray-600'>Modules Completed</p>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold text-blue-600'>200</div>
                <p className='text-sm text-gray-600'>Points Earned</p>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold text-purple-600'>5</div>
                <p className='text-sm text-gray-600'>Certificates</p>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold text-orange-600'>27%</div>
                <p className='text-sm text-gray-600'>Overall Progress</p>
              </div>
            </div>
            <div className='mt-6'>
              <div className='flex justify-between mb-2'>
                <span className='text-sm font-medium'>Overall Completion</span>
                <span className='text-sm text-gray-600'>1/6 modules</span>
              </div>
              <Progress value={17} className='h-3' />
            </div>
          </CardContent>
        </Card>

        {/* Learning Modules */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className='h-full hover:shadow-lg transition-all duration-300'>
                <CardHeader>
                  <div className='flex justify-between items-start mb-2'>
                    <Badge variant='outline' className='mb-2'>
                      {module.category}
                    </Badge>
                    {module.completed && <CheckCircle className='w-5 h-5 text-green-500' />}
                  </div>
                  <CardTitle className='text-xl font-bold flex items-center'>
                    <BookOpen className='w-5 h-5 mr-2 text-blue-500' />
                    {module.title}
                  </CardTitle>
                  <CardDescription className='text-gray-600'>{module.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className='space-y-4'>
                    {/* Module Stats */}
                    <div className='flex flex-wrap gap-2'>
                      <Badge className={getDifficultyColor(module.difficulty)}>
                        {module.difficulty}
                      </Badge>
                      <Badge variant='outline' className='flex items-center'>
                        <Clock className='w-3 h-3 mr-1' />
                        {module.duration}
                      </Badge>
                      <Badge variant='outline' className='flex items-center'>
                        <Play className='w-3 h-3 mr-1' />
                        {module.lessons} lessons
                      </Badge>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className='flex justify-between mb-2'>
                        <span className='text-sm font-medium'>Progress</span>
                        <span className='text-sm text-gray-600'>{module.progress}%</span>
                      </div>
                      <Progress value={module.progress} className='h-2' />
                    </div>

                    {/* Points */}
                    <div className='flex justify-between items-center'>
                      <div className='flex items-center text-green-600'>
                        <Award className='w-4 h-4 mr-1' />
                        <span className='font-semibold'>+{module.points} pts</span>
                      </div>
                      <div className='flex items-center text-yellow-500'>
                        <Star className='w-4 h-4 mr-1 fill-current' />
                        <span className='text-sm'>4.8</span>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardContent className='pt-0'>
                  <Link href={`/learning/${module.id}`}>
                    <Button className='w-full' variant={module.completed ? 'outline' : 'default'}>
                      {module.completed
                        ? 'Review Module'
                        : module.progress > 0
                          ? 'Continue Learning'
                          : 'Start Learning'}
                      <ChevronRight className='w-4 h-4 ml-2' />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Featured Content */}
        <div className='mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Quick Quiz */}
          <Card className='bg-gradient-to-r from-blue-500 to-purple-600 text-white'>
            <CardContent className='p-8'>
              <h3 className='text-2xl font-bold mb-4'>🧠 Quick Knowledge Check</h3>
              <p className='mb-6 opacity-90'>
                Test your waste management knowledge with our daily quiz
              </p>
              <Button variant='secondary' size='lg'>
                Take Quiz Now
              </Button>
            </CardContent>
          </Card>

          {/* Video Library */}
          <Card className='bg-gradient-to-r from-green-500 to-teal-600 text-white'>
            <CardContent className='p-8'>
              <h3 className='text-2xl font-bold mb-4'>🎥 Video Library</h3>
              <p className='mb-6 opacity-90'>
                Watch expert-led tutorials and real-world case studies
              </p>
              <Button variant='secondary' size='lg'>
                Browse Videos
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className='text-center mt-16'>
          <Card className='bg-green-600 text-white border-0'>
            <CardContent className='p-12'>
              <h2 className='text-3xl font-bold mb-4'>Start Your Learning Journey</h2>
              <p className='text-xl mb-8 opacity-90'>
                Join thousands of learners making a real impact on the environment
              </p>
              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <Link href='/register'>
                  <Button size='lg' variant='secondary' className='px-8'>
                    Create Free Account
                  </Button>
                </Link>
                <Link href='/learning/waste-basics'>
                  <Button
                    size='lg'
                    variant='outline'
                    className='px-8 text-white border-white hover:bg-white hover:text-green-600'
                  >
                    Start First Module
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
