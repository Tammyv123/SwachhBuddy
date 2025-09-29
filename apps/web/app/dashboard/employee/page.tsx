'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Calendar,
  Target,
  TrendingUp,
  Route,
  Award,
  BarChart3,
} from 'lucide-react'
import Link from 'next/link'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  userType: string
}

interface Assignment {
  id: string
  area: string
  status: 'pending' | 'in-progress' | 'completed'
  priority: 'high' | 'medium' | 'low'
  estimatedTime: string
  wasteType: string
}

export default function EmployeeDashboard() {
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
      if (parsedUser.userType !== 'employee') {
        router.push('/dashboard/citizen')
        return
      }
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
    assignmentsToday: 8,
    completedToday: 5,
    totalCollected: 145.8,
    efficiency: 87,
  }

  const todayAssignments: Assignment[] = [
    {
      id: '1',
      area: 'Sector 15, Dwarka',
      status: 'completed',
      priority: 'high',
      estimatedTime: '09:00 AM',
      wasteType: 'Mixed Waste',
    },
    {
      id: '2',
      area: 'Connaught Place',
      status: 'in-progress',
      priority: 'high',
      estimatedTime: '11:30 AM',
      wasteType: 'E-Waste',
    },
    {
      id: '3',
      area: 'Lajpat Nagar Market',
      status: 'pending',
      priority: 'medium',
      estimatedTime: '02:00 PM',
      wasteType: 'Organic Waste',
    },
    {
      id: '4',
      area: 'Karol Bagh',
      status: 'pending',
      priority: 'low',
      estimatedTime: '04:30 PM',
      wasteType: 'Recyclable',
    },
  ]

  const recentActivities = [
    {
      type: 'collection',
      description: 'Completed waste collection at Sector 15',
      time: '10:30 AM',
      amount: '28.5 kg',
    },
    {
      type: 'route',
      description: 'Optimized route for afternoon pickups',
      time: '09:15 AM',
      efficiency: '+12%',
    },
    {
      type: 'report',
      description: 'Submitted daily collection report',
      time: 'Yesterday',
      status: 'approved',
    },
  ]

  const quickActions = [
    {
      title: 'View Route',
      description: "Today's optimized route",
      icon: <Route className='h-5 w-5' />,
      link: '/employee/route',
      color: 'bg-blue-500',
    },
    {
      title: 'Manage Tasks',
      description: 'View and update assignments',
      icon: <CheckCircle className='h-5 w-5' />,
      link: '/employee/tasks',
      color: 'bg-green-500',
    },
    {
      title: 'Performance',
      description: 'Track your metrics',
      icon: <TrendingUp className='h-5 w-5' />,
      link: '/employee/performance',
      color: 'bg-purple-500',
    },
    {
      title: 'Report Issue',
      description: 'Report collection problems',
      icon: <AlertTriangle className='h-5 w-5' />,
      link: '/employee/report',
      color: 'bg-red-500',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'pending':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-4'>
            <div>
              <h1 className='text-2xl font-bold text-green-600'>SwachhBuddy</h1>
              <p className='text-sm text-gray-600'>Employee Dashboard</p>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='text-gray-700'>Welcome, {user.firstName}!</span>
              <Badge variant='outline' className='bg-green-50 text-green-700 border-green-200'>
                Municipal Employee
              </Badge>
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
            Good morning, {user.firstName}! 🚛
          </h2>
          <p className='text-gray-600'>
            Ready to make Delhi cleaner today? Here&apos;s your schedule.
          </p>
        </div>

        {/* Stats Overview */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Today&apos;s Assignments</CardTitle>
              <Calendar className='h-4 w-4 text-blue-600' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stats.assignmentsToday}</div>
              <p className='text-xs text-muted-foreground'>{stats.completedToday} completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Completed Today</CardTitle>
              <CheckCircle className='h-4 w-4 text-green-600' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stats.completedToday}</div>
              <p className='text-xs text-muted-foreground'>Out of {stats.assignmentsToday} total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Waste Collected</CardTitle>
              <Truck className='h-4 w-4 text-green-600' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stats.totalCollected} kg</div>
              <p className='text-xs text-muted-foreground'>This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Efficiency Score</CardTitle>
              <TrendingUp className='h-4 w-4 text-blue-600' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stats.efficiency}%</div>
              <p className='text-xs text-muted-foreground'>+5% from last week</p>
            </CardContent>
          </Card>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Today's Assignments */}
          <Card className='lg:col-span-2'>
            <CardHeader>
              <CardTitle>Today&apos;s Assignments</CardTitle>
              <CardDescription>Your scheduled waste collection tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {todayAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className='flex items-center justify-between p-4 border rounded-lg'
                  >
                    <div className='flex items-center space-x-4'>
                      <div className='p-2 rounded-lg bg-gray-100'>
                        <MapPin className='h-4 w-4 text-gray-600' />
                      </div>
                      <div>
                        <h3 className='font-medium'>{assignment.area}</h3>
                        <p className='text-sm text-gray-600'>{assignment.wasteType}</p>
                        <div className='flex items-center space-x-2 mt-1'>
                          <Clock className='h-3 w-3 text-gray-400' />
                          <span className='text-xs text-gray-500'>{assignment.estimatedTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className='flex flex-col items-end space-y-2'>
                      <Badge className={getStatusColor(assignment.status)}>
                        {assignment.status.replace('-', ' ')}
                      </Badge>
                      <Badge variant='outline' className={getPriorityColor(assignment.priority)}>
                        {assignment.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {quickActions.map((action) => (
                  <Link key={action.title} href={action.link}>
                    <div className='flex items-center p-3 border rounded-lg hover:shadow-md transition-shadow cursor-pointer'>
                      <div className={`p-2 rounded-lg ${action.color} text-white mr-3`}>
                        {action.icon}
                      </div>
                      <div>
                        <h3 className='font-medium text-sm'>{action.title}</h3>
                        <p className='text-xs text-gray-600'>{action.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Performance */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8'>
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest work updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {recentActivities.map((activity, index) => (
                  <div key={index} className='flex items-start space-x-3'>
                    <div className='w-2 h-2 rounded-full bg-green-500 mt-2'></div>
                    <div className='flex-1'>
                      <p className='text-sm font-medium'>{activity.description}</p>
                      <div className='flex items-center justify-between mt-1'>
                        <span className='text-xs text-gray-500'>{activity.time}</span>
                        <div className='text-xs'>
                          {activity.amount && <Badge variant='secondary'>{activity.amount}</Badge>}
                          {activity.efficiency && (
                            <Badge variant='outline' className='bg-green-50 text-green-700'>
                              {activity.efficiency}
                            </Badge>
                          )}
                          {activity.status && (
                            <Badge variant='outline' className='bg-blue-50 text-blue-700'>
                              {activity.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Your work progress this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div>
                  <div className='flex justify-between mb-2'>
                    <span className='text-sm font-medium'>Collection Target</span>
                    <span className='text-sm text-gray-600'>145.8kg / 160kg</span>
                  </div>
                  <Progress value={91} className='h-2' />
                </div>
                <div>
                  <div className='flex justify-between mb-2'>
                    <span className='text-sm font-medium'>Route Efficiency</span>
                    <span className='text-sm text-gray-600'>87%</span>
                  </div>
                  <Progress value={87} className='h-2' />
                </div>
                <div>
                  <div className='flex justify-between mb-2'>
                    <span className='text-sm font-medium'>On-Time Completion</span>
                    <span className='text-sm text-gray-600'>23 / 25 tasks</span>
                  </div>
                  <Progress value={92} className='h-2' />
                </div>
                <div>
                  <div className='flex justify-between mb-2'>
                    <span className='text-sm font-medium'>Citizen Satisfaction</span>
                    <span className='text-sm text-gray-600'>4.6 / 5.0</span>
                  </div>
                  <Progress value={92} className='h-2' />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
