'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Star, Clock, Users, Award } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function PlayPage() {
  const games = [
    {
      id: 'waste-sorting',
      title: 'Waste Sorting Challenge',
      description: 'Learn to sort different types of waste correctly',
      difficulty: 'Easy',
      duration: '5 min',
      players: '1.2k',
      rating: 4.8,
      points: 50,
      image: '/waste-sorting-preview.jpg',
      category: 'Educational',
      color: 'bg-green-500',
    },
    {
      id: 'eco-sorter',
      title: 'Eco Sorter',
      description: 'Fast-paced waste segregation game',
      difficulty: 'Medium',
      duration: '10 min',
      players: '890',
      rating: 4.6,
      points: 100,
      image: '/eco-sorter-preview.jpg',
      category: 'Arcade',
      color: 'bg-blue-500',
    },
    {
      id: 'eco-runner',
      title: 'Eco Runner',
      description: 'Run through the city collecting waste and avoiding obstacles',
      difficulty: 'Medium',
      duration: '15 min',
      players: '2.1k',
      rating: 4.9,
      points: 150,
      image: '/eco-runner-preview.jpg',
      category: 'Action',
      color: 'bg-purple-500',
    },
    {
      id: 'eco-mario',
      title: 'Eco Mario Adventure',
      description: 'Mario-style platformer with environmental themes',
      difficulty: 'Hard',
      duration: '20 min',
      players: '1.5k',
      rating: 4.7,
      points: 200,
      image: '/eco-mario-preview.jpg',
      category: 'Platform',
      color: 'bg-red-500',
    },
    {
      id: 'eco-escape',
      title: 'Eco Escape Room',
      description: 'Solve environmental puzzles to escape',
      difficulty: 'Hard',
      duration: '25 min',
      players: '650',
      rating: 4.5,
      points: 250,
      image: '/eco-escape-preview.jpg',
      category: 'Puzzle',
      color: 'bg-yellow-500',
    },
    {
      id: 'waste-management',
      title: 'City Waste Manager',
      description: 'Manage waste collection for an entire city',
      difficulty: 'Expert',
      duration: '30 min',
      players: '420',
      rating: 4.4,
      points: 300,
      image: '/waste-manager-preview.jpg',
      category: 'Strategy',
      color: 'bg-indigo-500',
    },
  ]

  const categories = ['All', 'Educational', 'Arcade', 'Action', 'Platform', 'Puzzle', 'Strategy']

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'Hard':
        return 'bg-orange-100 text-orange-800'
      case 'Expert':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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
                <Link href='/play' className='text-green-600 font-medium'>
                  Play
                </Link>
                <Link href='/earn' className='text-gray-700 hover:text-green-600'>
                  Earn
                </Link>
                <Link href='/resolve' className='text-gray-700 hover:text-green-600'>
                  Resolve
                </Link>
                <Link href='/learning' className='text-gray-700 hover:text-green-600'>
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
            <h1 className='text-4xl md:text-6xl font-bold text-gray-900 mb-4'>Play & Learn 🎮</h1>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto mb-8'>
              Make learning fun with our collection of eco-friendly games. Earn points, compete with
              friends, and save the environment!
            </p>
            <div className='flex justify-center space-x-4'>
              <Badge variant='secondary' className='text-lg px-4 py-2'>
                <Users className='w-4 h-4 mr-2' />
                5.2k Active Players
              </Badge>
              <Badge variant='secondary' className='text-lg px-4 py-2'>
                <Award className='w-4 h-4 mr-2' />
                850k Points Earned
              </Badge>
            </div>
          </motion.div>
        </div>

        {/* Category Filter */}
        <div className='flex flex-wrap justify-center gap-4 mb-12'>
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === 'All' ? 'default' : 'outline'}
              className='rounded-full'
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Games Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className='h-full hover:shadow-xl transition-all duration-300 group'>
                <CardHeader className='relative overflow-hidden rounded-t-lg'>
                  <div
                    className={`h-48 ${game.color} rounded-lg flex items-center justify-center relative`}
                  >
                    <div className='text-white text-6xl'>🎮</div>
                    <Badge className='absolute top-4 right-4' variant='secondary'>
                      {game.category}
                    </Badge>
                    <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center'>
                      <Play className='w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-all duration-300' />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className='p-6'>
                  <div className='flex justify-between items-start mb-2'>
                    <CardTitle className='text-xl font-bold'>{game.title}</CardTitle>
                    <div className='flex items-center space-x-1'>
                      <Star className='w-4 h-4 text-yellow-500 fill-current' />
                      <span className='text-sm font-medium'>{game.rating}</span>
                    </div>
                  </div>

                  <CardDescription className='text-gray-600 mb-4'>
                    {game.description}
                  </CardDescription>

                  <div className='flex flex-wrap gap-2 mb-4'>
                    <Badge className={getDifficultyColor(game.difficulty)}>{game.difficulty}</Badge>
                    <Badge variant='outline' className='flex items-center'>
                      <Clock className='w-3 h-3 mr-1' />
                      {game.duration}
                    </Badge>
                    <Badge variant='outline' className='flex items-center'>
                      <Users className='w-3 h-3 mr-1' />
                      {game.players}
                    </Badge>
                  </div>

                  <div className='flex justify-between items-center'>
                    <div className='flex items-center text-green-600'>
                      <Award className='w-4 h-4 mr-1' />
                      <span className='font-semibold'>+{game.points} pts</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className='px-6 pb-6'>
                  <Link href={`/games/${game.id}`} className='w-full'>
                    <Button className='w-full' size='lg'>
                      <Play className='w-4 h-4 mr-2' />
                      Play Now
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <div className='text-center mt-16'>
          <Card className='bg-green-600 text-white border-0'>
            <CardContent className='p-12'>
              <h2 className='text-3xl font-bold mb-4'>Ready to Start Playing?</h2>
              <p className='text-xl mb-8 opacity-90'>
                Join thousands of players making a difference while having fun!
              </p>
              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <Link href='/register'>
                  <Button size='lg' variant='secondary' className='px-8'>
                    Create Free Account
                  </Button>
                </Link>
                <Link href='/leaderboard'>
                  <Button
                    size='lg'
                    variant='outline'
                    className='px-8 text-white border-white hover:bg-white hover:text-green-600'
                  >
                    View Leaderboard
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
