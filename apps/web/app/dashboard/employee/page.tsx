'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Truck,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Route,
  Scan,
  X,
  Check,
} from 'lucide-react'
import Link from 'next/link'
import QrScanner from 'react-qr-scanner'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role?: string // From backend auth service
  userType?: string // For backward compatibility
}

interface PickupRequest {
  id: string
  address: string
  status: 'pending' | 'accepted' | 'rejected'
  requestTime: string
  wasteType: string
  citizenName: string
}

export default function EmployeeDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [itemCount, setItemCount] = useState('')
  const [citizenId, setCitizenId] = useState('')
  const [qrData, setQrData] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()

  const handleGenerateQR = (e: React.FormEvent) => {
    e.preventDefault()
    // Create QR data with timestamp to make each QR code unique
    const data = JSON.stringify({
      citizenId,
      itemCount: parseInt(itemCount),
      timestamp: new Date().toISOString(),
    })
    
    // Create a base64 encoded string of the data
    const encodedData = Buffer.from(data).toString('base64')
    setQrData(encodedData)
    setShowSuccess(true)
  }

  const handleReset = () => {
    setItemCount('')
    setCitizenId('')
    setQrData(null)
    setShowSuccess(false)
  }

  const handlePointsEarned = (points: number) => {
    // Handle points earned from scanning
    console.log(`Points earned: ${points}`)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleCloseScanner = () => {
    setShowScanner(false)
  }

  const handlePickupRequest = async (requestId: string, status: 'accepted' | 'rejected') => {
    // Here you would make an API call to update the request status
    console.log(`Request ${requestId} ${status}`)
    // Update the UI accordingly
  }

  useEffect(() => {
    // Check for user data
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('accessToken')

    if (!userData || !token || userData === 'undefined' || userData === 'null') {
      router.push('/login')
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      // Check for both 'role' (from backend) and 'userType' (for backward compatibility)
      if (parsedUser.role !== 'employee' && parsedUser.userType !== 'employee') {
        router.push('/dashboard/citizen')
        return
      }
      setUser(parsedUser)
    } catch (error) {
      console.error('Error parsing user data:', error)
      localStorage.removeItem('user')
      localStorage.removeItem('accessToken')
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

  // Mock pickup requests
  const pickupRequests: PickupRequest[] = [
    {
      id: '1',
      address: 'Block A, Sector 15, Dwarka',
      status: 'pending',
      requestTime: '30 mins ago',
      wasteType: 'Mixed Waste',
      citizenName: 'Rajesh Kumar',
    },
    {
      id: '2',
      address: 'C-45, Connaught Place',
      status: 'pending',
      requestTime: '1 hour ago',
      wasteType: 'Organic Waste',
      citizenName: 'Priya Singh',
    },
    {
      id: '3',
      address: 'Shop 12, Lajpat Nagar Market',
      status: 'pending',
      requestTime: '2 hours ago',
      wasteType: 'Recyclable',
      citizenName: 'Amit Sharma',
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
              <p className='text-sm text-gray-600'>Employee Dashboard</p>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='text-gray-700'>Welcome, {user.firstName}!</span>
              <Badge className='bg-green-50 text-green-700 border-green-200'>
                Municipal Employee
              </Badge>
              <Button onClick={handleLogout} className='border border-gray-300 hover:bg-gray-100'>
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

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* QR Generator Section */}
          <Card>
            <CardHeader>
              <CardTitle>Generate Disposal QR Code</CardTitle>
              <CardDescription>Create QR code for recording recycled items</CardDescription>
            </CardHeader>
            <CardContent>
              {showScanner ? (
                <div className='relative'>
                  <QrScanner
                    delay={300}
                    onError={handleError}
                    onScan={handleScan}
                    style={{ width: '100%' }}
                  />
                  <Button
                    onClick={() => setShowScanner(false)}
                    className='absolute top-2 right-2 bg-red-500 hover:bg-red-600'
                  >
                    Close Scanner
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleGenerateQR} className='space-y-4'>
                  <div>
                    <label htmlFor="itemCount" className='block text-sm font-medium text-gray-700 mb-1'>
                      Number of Items Recycled
                    </label>
                    <input
                      type="number"
                      id="itemCount"
                      value={itemCount}
                      onChange={(e) => setItemCount(e.target.value)}
                      className='w-full p-2 border rounded-md'
                      required
                      min="1"
                    />
                  </div>
                  <div>
                    <label htmlFor="citizenId" className='block text-sm font-medium text-gray-700 mb-1'>
                      Citizen ID
                    </label>
                    <input
                      type="text"
                      id="citizenId"
                      value={citizenId}
                      onChange={(e) => setCitizenId(e.target.value)}
                      className='w-full p-2 border rounded-md'
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className='w-full bg-green-500 hover:bg-green-600'
                  >
                    Generate QR Code
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Pickup Requests */}
          <Card>
            <CardHeader>
              <CardTitle>Pickup Requests</CardTitle>
              <CardDescription>Citizen requests waiting for your response</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {pickupRequests.map((request) => (
                  <div key={request.id} className='p-4 border rounded-lg space-y-2'>
                    <div className='flex justify-between items-start'>
                      <div>
                        <h3 className='font-medium'>{request.citizenName}</h3>
                        <p className='text-sm text-gray-600'>{request.address}</p>
                        <div className='flex items-center space-x-2 mt-1'>
                          <Clock className='h-3 w-3 text-gray-400' />
                          <span className='text-xs text-gray-500'>{request.requestTime}</span>
                        </div>
                      </div>
                      <Badge className='bg-blue-50 text-blue-700'>{request.wasteType}</Badge>
                    </div>
                    <div className='flex space-x-2 justify-end'>
                      <Button
                        onClick={() => handlePickupRequest(request.id, 'rejected')}
                        className='bg-red-500 hover:bg-red-600 h-8 text-sm'
                      >
                        <X className='h-4 w-4 mr-1' />
                        Reject
                      </Button>
                      <Button
                        onClick={() => handlePickupRequest(request.id, 'accepted')}
                        className='bg-green-500 hover:bg-green-600 h-8 text-sm'
                      >
                        <Check className='h-4 w-4 mr-1' />
                        Accept
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card className='mt-8'>
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
  )
}
