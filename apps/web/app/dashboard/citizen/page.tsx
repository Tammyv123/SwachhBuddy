'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Recycle, Award, TrendingUp, Calendar, MapPin, Play, BookOpen, Users } from 'lucide-react'
import Link from 'next/link'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  userType: string
}

export default function CitizenDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for user data
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('accessToken')

    if (!userData || !token) {
      router.push('/login')
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    } catch (error) {
      console.error('Error parsing user data:', error)
      router.push('/login')
      return
    }

    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    router.push('/')
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-green-500'></div>
          <p className='mt-4 text-gray-600'>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Mock data for demonstration
  const stats = {
    wasteCollected: 45.6,
    pointsEarned: 1250,
    rankPosition: 42,
    co2Saved: 23.8,
  }

  const recentActivities = [
    {
      type: 'waste-collection',
      description: 'Segregated 2.3kg organic waste',
      points: 50,
      date: 'Today',
    },
    { type: 'game', description: 'Completed Eco Sorter Level 5', points: 25, date: 'Yesterday' },
    {
      type: 'learning',
      description: 'Finished Waste Basics Module',
      points: 100,
      date: '2 days ago',
    },
  ]

  const quickActions = [
    {
      title: 'Play Games',
      description: 'Learn through fun games',
      icon: <Play className='h-5 w-5' />,
      link: '/play',
      color: 'bg-blue-500',
    },
    {
      title: 'Learning Hub',
      description: 'Educational content',
      icon: <BookOpen className='h-5 w-5' />,
      link: '/learning',
      color: 'bg-green-500',
    },
    {
      title: 'Find Collection Points',
      description: 'Locate nearby centers',
      icon: <MapPin className='h-5 w-5' />,
      link: '/map',
      color: 'bg-purple-500',
    },
    {
      title: 'Community',
      description: 'Connect with others',
      icon: <Users className='h-5 w-5' />,
      link: '/community',
      color: 'bg-orange-500',
    },
  ]

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-4'>
            <div>
              <h1 className='text-2xl font-bold text-green-600'>SwachhBuddy</h1>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='text-gray-700'>Welcome, {user.firstName}!</span>
              <Button variant='outline' onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Welcome Section */}
        <div className='mb-8'>
          <h2 className='text-3xl font-bold text-gray-900 mb-2'>
            Welcome back, {user.firstName}! 🌱
          </h2>
          <p className='text-gray-600'>Continue your journey towards a cleaner, greener India</p>
        </div>

        {/* Stats Overview */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Waste Collected</CardTitle>
              <Recycle className='h-4 w-4 text-green-600' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stats.wasteCollected} kg</div>
              <p className='text-xs text-muted-foreground'>This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Points Earned</CardTitle>
              <Award className='h-4 w-4 text-yellow-600' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stats.pointsEarned}</div>
              <p className='text-xs text-muted-foreground'>Total points</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Community Rank</CardTitle>
              <TrendingUp className='h-4 w-4 text-blue-600' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>#{stats.rankPosition}</div>
              <p className='text-xs text-muted-foreground'>In your area</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>CO₂ Saved</CardTitle>
              <div className='h-4 w-4 text-green-600'>🌍</div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stats.co2Saved} kg</div>
              <p className='text-xs text-muted-foreground'>This month</p>
            </CardContent>
          </Card>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Quick Actions */}
          <Card className='lg:col-span-2'>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>What would you like to do today?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 gap-4'>
                {quickActions.map((action) => (
                  <Link key={action.title} href={action.link}>
                    <div className='flex items-center p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer'>
                      <div className={`p-2 rounded-lg ${action.color} text-white mr-3`}>
                        {action.icon}
                      </div>
                      <div>
                        <h3 className='font-medium'>{action.title}</h3>
                        <p className='text-sm text-gray-600'>{action.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest eco-friendly actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {recentActivities.map((activity, index) => (
                  <div key={index} className='flex items-start space-x-3'>
                    <div className='w-2 h-2 rounded-full bg-green-500 mt-2'></div>
                    <div className='flex-1'>
                      <p className='text-sm font-medium'>{activity.description}</p>
                      <div className='flex items-center justify-between mt-1'>
                        <span className='text-xs text-gray-500'>{activity.date}</span>
                        <Badge variant='secondary' className='text-xs'>
                          +{activity.points} pts
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Section */}
        <Card className='mt-8'>
          <CardHeader>
            <CardTitle>Monthly Progress</CardTitle>
            <CardDescription>You&apos;re doing great! Keep up the excellent work.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div>
                <div className='flex justify-between mb-2'>
                  <span className='text-sm font-medium'>Waste Collection Goal</span>
                  <span className='text-sm text-gray-600'>45.6kg / 50kg</span>
                </div>
                <Progress value={91} className='h-2' />
              </div>
              <div>
                <div className='flex justify-between mb-2'>
                  <span className='text-sm font-medium'>Learning Modules</span>
                  <span className='text-sm text-gray-600'>7 / 10 completed</span>
                </div>
                <Progress value={70} className='h-2' />
              </div>
              <div>
                <div className='flex justify-between mb-2'>
                  <span className='text-sm font-medium'>Community Engagement</span>
                  <span className='text-sm text-gray-600'>12 / 15 activities</span>
                </div>
                <Progress value={80} className='h-2' />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
