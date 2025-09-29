'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  TrendingUp,
  Award,
  Target,
  Calendar,
  Clock,
  Users,
  Star,
  Trophy,
  BarChart3,
  CheckCircle,
} from 'lucide-react'

interface PerformanceData {
  daily: {
    tasksCompleted: number
    totalTasks: number
    wasteCollected: number
    efficiency: number
    rating: number
  }
  weekly: {
    tasksCompleted: number
    totalTasks: number
    wasteCollected: number
    efficiency: number
    onTimeCompletion: number
  }
  monthly: {
    tasksCompleted: number
    totalTasks: number
    wasteCollected: number
    efficiency: number
    ranking: number
    totalEmployees: number
  }
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  date: string
  points: number
  category: 'efficiency' | 'collection' | 'safety' | 'teamwork'
}

export default function PerformanceTracker() {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')

  const performanceData: PerformanceData = {
    daily: {
      tasksCompleted: 5,
      totalTasks: 8,
      wasteCollected: 28.5,
      efficiency: 87,
      rating: 4.6,
    },
    weekly: {
      tasksCompleted: 32,
      totalTasks: 40,
      wasteCollected: 165.3,
      efficiency: 85,
      onTimeCompletion: 92,
    },
    monthly: {
      tasksCompleted: 145,
      totalTasks: 160,
      wasteCollected: 682.7,
      efficiency: 91,
      ranking: 12,
      totalEmployees: 150,
    },
  }

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Efficiency Master',
      description: 'Maintained 90%+ efficiency for 7 days',
      icon: '⚡',
      date: '2024-01-15',
      points: 100,
      category: 'efficiency',
    },
    {
      id: '2',
      title: 'Collection Champion',
      description: 'Collected 500kg+ waste this month',
      icon: '🏆',
      date: '2024-01-10',
      points: 150,
      category: 'collection',
    },
    {
      id: '3',
      title: 'Safety First',
      description: 'Zero safety incidents for 30 days',
      icon: '🛡️',
      date: '2024-01-08',
      points: 75,
      category: 'safety',
    },
    {
      id: '4',
      title: 'Team Player',
      description: 'Helped colleagues complete 5 tasks',
      icon: '🤝',
      date: '2024-01-05',
      points: 50,
      category: 'teamwork',
    },
  ]

  const currentData = performanceData[selectedPeriod]

  const getAchievementColor = (category: string) => {
    switch (category) {
      case 'efficiency':
        return 'bg-blue-100 text-blue-800'
      case 'collection':
        return 'bg-green-100 text-green-800'
      case 'safety':
        return 'bg-yellow-100 text-yellow-800'
      case 'teamwork':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const targets = {
    daily: { tasks: 8, waste: 35, efficiency: 90 },
    weekly: { tasks: 40, waste: 200, efficiency: 88 },
    monthly: { tasks: 160, waste: 800, efficiency: 85 },
  }

  const currentTargets = targets[selectedPeriod]

  return (
    <div className='space-y-6'>
      {/* Period Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Tracker</CardTitle>
          <CardDescription>Monitor your work performance and achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex space-x-2'>
            <Button
              variant={selectedPeriod === 'daily' ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod('daily')}
            >
              Daily
            </Button>
            <Button
              variant={selectedPeriod === 'weekly' ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod('weekly')}
            >
              Weekly
            </Button>
            <Button
              variant={selectedPeriod === 'monthly' ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod('monthly')}
            >
              Monthly
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Tasks Completed</CardTitle>
            <CheckCircle className='h-4 w-4 text-green-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{currentData.tasksCompleted}</div>
            <p className='text-xs text-muted-foreground'>of {currentData.totalTasks} assigned</p>
            <Progress
              value={(currentData.tasksCompleted / currentData.totalTasks) * 100}
              className='mt-2 h-2'
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Waste Collected</CardTitle>
            <Target className='h-4 w-4 text-blue-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{currentData.wasteCollected} kg</div>
            <p className='text-xs text-muted-foreground'>Target: {currentTargets.waste} kg</p>
            <Progress
              value={(currentData.wasteCollected / currentTargets.waste) * 100}
              className='mt-2 h-2'
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Efficiency Score</CardTitle>
            <TrendingUp className='h-4 w-4 text-green-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{currentData.efficiency}%</div>
            <p className='text-xs text-muted-foreground'>Target: {currentTargets.efficiency}%</p>
            <Progress value={currentData.efficiency} className='mt-2 h-2' />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              {selectedPeriod === 'monthly' ? 'Ranking' : 'Rating'}
            </CardTitle>
            <Award className='h-4 w-4 text-yellow-600' />
          </CardHeader>
          <CardContent>
            {selectedPeriod === 'monthly' ? (
              <>
                <div className='text-2xl font-bold'>#{(currentData as any).ranking}</div>
                <p className='text-xs text-muted-foreground'>
                  of {(currentData as any).totalEmployees} employees
                </p>
              </>
            ) : (
              <>
                <div className='text-2xl font-bold'>{(currentData as any).rating || 4.6}/5</div>
                <p className='text-xs text-muted-foreground'>Average rating</p>
                <div className='flex mt-1'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3 w-3 ${star <= Math.floor((currentData as any).rating || 4.6) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Performance */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Performance Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Breakdown</CardTitle>
            <CardDescription>
              {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} performance details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div>
                <div className='flex justify-between mb-2'>
                  <span className='text-sm font-medium'>Task Completion Rate</span>
                  <span className='text-sm text-gray-600'>
                    {Math.round((currentData.tasksCompleted / currentData.totalTasks) * 100)}%
                  </span>
                </div>
                <Progress
                  value={(currentData.tasksCompleted / currentData.totalTasks) * 100}
                  className='h-2'
                />
              </div>

              <div>
                <div className='flex justify-between mb-2'>
                  <span className='text-sm font-medium'>Collection Target</span>
                  <span className='text-sm text-gray-600'>
                    {Math.round((currentData.wasteCollected / currentTargets.waste) * 100)}%
                  </span>
                </div>
                <Progress
                  value={(currentData.wasteCollected / currentTargets.waste) * 100}
                  className='h-2'
                />
              </div>

              <div>
                <div className='flex justify-between mb-2'>
                  <span className='text-sm font-medium'>Efficiency Score</span>
                  <span className='text-sm text-gray-600'>{currentData.efficiency}%</span>
                </div>
                <Progress value={currentData.efficiency} className='h-2' />
              </div>

              {selectedPeriod === 'weekly' && (
                <div>
                  <div className='flex justify-between mb-2'>
                    <span className='text-sm font-medium'>On-Time Completion</span>
                    <span className='text-sm text-gray-600'>
                      {(currentData as any).onTimeCompletion || 92}%
                    </span>
                  </div>
                  <Progress value={(currentData as any).onTimeCompletion || 92} className='h-2' />
                </div>
              )}
            </div>

            {/* Performance Insights */}
            <div className='mt-6 p-4 bg-blue-50 rounded-lg'>
              <h4 className='font-medium text-blue-900 mb-2'>Performance Insights</h4>
              <ul className='text-sm text-blue-800 space-y-1'>
                <li>
                  • Your efficiency is{' '}
                  {currentData.efficiency > currentTargets.efficiency ? 'above' : 'below'} target
                </li>
                <li>
                  • You&apos;re on track to{' '}
                  {(currentData.wasteCollected / currentTargets.waste) * 100 > 80
                    ? 'exceed'
                    : 'meet'}{' '}
                  collection goals
                </li>
                {selectedPeriod === 'monthly' && (
                  <li>
                    • You rank in the top{' '}
                    {Math.round(
                      ((currentData as any).ranking / (currentData as any).totalEmployees) * 100
                    )}
                    % of employees
                  </li>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
            <CardDescription>Your latest accomplishments and rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className='flex items-start space-x-3 p-3 border rounded-lg'
                >
                  <div className='text-2xl'>{achievement.icon}</div>
                  <div className='flex-1'>
                    <h3 className='font-medium'>{achievement.title}</h3>
                    <p className='text-sm text-gray-600'>{achievement.description}</p>
                    <div className='flex items-center justify-between mt-2'>
                      <span className='text-xs text-gray-500'>{achievement.date}</span>
                      <div className='flex items-center space-x-2'>
                        <Badge className={getAchievementColor(achievement.category)}>
                          {achievement.category}
                        </Badge>
                        <Badge variant='outline'>+{achievement.points} pts</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Achievement Summary */}
            <div className='mt-6 p-4 bg-green-50 rounded-lg'>
              <div className='flex items-center justify-between'>
                <div>
                  <h4 className='font-medium text-green-900'>Total Achievement Points</h4>
                  <p className='text-sm text-green-700'>Earned this month</p>
                </div>
                <div className='text-2xl font-bold text-green-600'>
                  {achievements.reduce((sum, ach) => sum + ach.points, 0)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals and Targets */}
      <Card>
        <CardHeader>
          <CardTitle>Goals & Targets</CardTitle>
          <CardDescription>Your performance targets for the current period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='text-center p-4 border rounded-lg'>
              <Target className='h-8 w-8 text-blue-600 mx-auto mb-2' />
              <div className='text-xl font-bold'>{currentTargets.tasks}</div>
              <div className='text-sm text-gray-600'>Task Target</div>
              <div className='text-xs text-gray-500 mt-1'>
                {currentData.tasksCompleted} completed
              </div>
            </div>
            <div className='text-center p-4 border rounded-lg'>
              <BarChart3 className='h-8 w-8 text-green-600 mx-auto mb-2' />
              <div className='text-xl font-bold'>{currentTargets.waste}kg</div>
              <div className='text-sm text-gray-600'>Collection Target</div>
              <div className='text-xs text-gray-500 mt-1'>
                {currentData.wasteCollected}kg collected
              </div>
            </div>
            <div className='text-center p-4 border rounded-lg'>
              <Trophy className='h-8 w-8 text-yellow-600 mx-auto mb-2' />
              <div className='text-xl font-bold'>{currentTargets.efficiency}%</div>
              <div className='text-sm text-gray-600'>Efficiency Target</div>
              <div className='text-xs text-gray-500 mt-1'>{currentData.efficiency}% current</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
