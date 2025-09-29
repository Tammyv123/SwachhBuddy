'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  MapPin,
  Route,
  Clock,
  Navigation,
  Fuel,
  AlertCircle,
  CheckCircle,
  Truck,
} from 'lucide-react'

interface RouteStop {
  id: string
  area: string
  address: string
  estimatedTime: string
  wasteType: string
  status: 'pending' | 'completed' | 'current'
  priority: 'high' | 'medium' | 'low'
  estimatedDuration: string
}

interface RouteOptimizerProps {
  stops?: RouteStop[]
}

export default function RouteOptimizer({ stops = [] }: RouteOptimizerProps) {
  const [currentLocation, setCurrentLocation] = useState<string>('Municipal Office')
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [routeOptimized, setRouteOptimized] = useState(false)

  // Mock data if no stops provided
  const defaultStops: RouteStop[] = [
    {
      id: '1',
      area: 'Sector 15, Dwarka',
      address: 'Block A, Sector 15, Dwarka',
      estimatedTime: '09:00 AM',
      wasteType: 'Mixed Waste',
      status: 'completed',
      priority: 'high',
      estimatedDuration: '30 min',
    },
    {
      id: '2',
      area: 'Connaught Place',
      address: 'Central Park, CP',
      estimatedTime: '11:30 AM',
      wasteType: 'E-Waste',
      status: 'current',
      priority: 'high',
      estimatedDuration: '45 min',
    },
    {
      id: '3',
      area: 'Lajpat Nagar Market',
      address: 'Central Market, Lajpat Nagar',
      estimatedTime: '02:00 PM',
      wasteType: 'Organic Waste',
      status: 'pending',
      priority: 'medium',
      estimatedDuration: '25 min',
    },
    {
      id: '4',
      area: 'Karol Bagh',
      address: 'Main Market, Karol Bagh',
      estimatedTime: '04:30 PM',
      wasteType: 'Recyclable',
      status: 'pending',
      priority: 'low',
      estimatedDuration: '20 min',
    },
  ]

  const routeStops = stops.length > 0 ? stops : defaultStops

  const routeStats = {
    totalStops: routeStops.length,
    completedStops: routeStops.filter((stop) => stop.status === 'completed').length,
    totalDistance: '47.2 km',
    estimatedTime: '4h 30min',
    fuelEfficiency: '85%',
    optimizationSaving: '23%',
  }

  const handleOptimizeRoute = () => {
    setIsOptimizing(true)
    // Simulate route optimization
    setTimeout(() => {
      setIsOptimizing(false)
      setRouteOptimized(true)
    }, 2000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className='h-4 w-4 text-green-600' />
      case 'current':
        return <Navigation className='h-4 w-4 text-blue-600' />
      case 'pending':
        return <Clock className='h-4 w-4 text-gray-400' />
      default:
        return <Clock className='h-4 w-4 text-gray-400' />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'current':
        return 'bg-blue-100 text-blue-800'
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
    <div className='space-y-6'>
      {/* Route Overview */}
      <Card>
        <CardHeader>
          <div className='flex justify-between items-start'>
            <div>
              <CardTitle>Route Optimizer</CardTitle>
              <CardDescription>
                Optimize your collection route for maximum efficiency
              </CardDescription>
            </div>
            <div className='flex space-x-2'>
              <Button variant='outline' onClick={handleOptimizeRoute} disabled={isOptimizing}>
                {isOptimizing ? 'Optimizing...' : 'Optimize Route'}
              </Button>
              <Button>Start Navigation</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {routeOptimized && (
            <div className='bg-green-50 border border-green-200 rounded-lg p-4 mb-4'>
              <div className='flex items-center'>
                <CheckCircle className='h-5 w-5 text-green-600 mr-2' />
                <span className='text-green-800 font-medium'>Route optimized successfully!</span>
              </div>
              <p className='text-green-700 text-sm mt-1'>
                New route saves 23% travel time and reduces fuel consumption by 15%.
              </p>
            </div>
          )}

          {/* Route Stats */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-blue-600'>{routeStats.totalStops}</div>
              <div className='text-sm text-gray-600'>Total Stops</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-green-600'>{routeStats.completedStops}</div>
              <div className='text-sm text-gray-600'>Completed</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-purple-600'>{routeStats.totalDistance}</div>
              <div className='text-sm text-gray-600'>Total Distance</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-orange-600'>{routeStats.estimatedTime}</div>
              <div className='text-sm text-gray-600'>Est. Time</div>
            </div>
          </div>

          {/* Current Location */}
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
            <div className='flex items-center'>
              <MapPin className='h-5 w-5 text-blue-600 mr-2' />
              <span className='font-medium text-blue-800'>Current Location: {currentLocation}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Route Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Route Details</CardTitle>
          <CardDescription>Your optimized collection route for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {routeStops.map((stop, index) => (
              <div key={stop.id} className='flex items-start space-x-4'>
                {/* Step Number and Line */}
                <div className='flex flex-col items-center'>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
                      stop.status === 'completed'
                        ? 'bg-green-500 text-white'
                        : stop.status === 'current'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < routeStops.length - 1 && (
                    <div
                      className={`w-0.5 h-16 ${
                        stop.status === 'completed' ? 'bg-green-300' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>

                {/* Stop Details */}
                <div
                  className={`flex-1 border rounded-lg p-4 ${
                    stop.status === 'current' ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className='flex justify-between items-start'>
                    <div className='flex-1'>
                      <div className='flex items-center space-x-2 mb-1'>
                        {getStatusIcon(stop.status)}
                        <h3 className='font-medium'>{stop.area}</h3>
                      </div>
                      <p className='text-sm text-gray-600 mb-2'>{stop.address}</p>
                      <div className='flex items-center space-x-4 text-sm text-gray-500'>
                        <div className='flex items-center space-x-1'>
                          <Clock className='h-3 w-3' />
                          <span>{stop.estimatedTime}</span>
                        </div>
                        <div className='flex items-center space-x-1'>
                          <Truck className='h-3 w-3' />
                          <span>{stop.wasteType}</span>
                        </div>
                        <div className='flex items-center space-x-1'>
                          <Route className='h-3 w-3' />
                          <span>{stop.estimatedDuration}</span>
                        </div>
                      </div>
                    </div>
                    <div className='flex flex-col items-end space-y-1'>
                      <Badge className={getStatusColor(stop.status)}>{stop.status}</Badge>
                      <Badge variant='outline' className={getPriorityColor(stop.priority)}>
                        {stop.priority}
                      </Badge>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className='flex justify-end space-x-2 mt-3 pt-3 border-t'>
                    {stop.status === 'current' && (
                      <>
                        <Button size='sm' variant='outline'>
                          View on Map
                        </Button>
                        <Button size='sm'>Navigate</Button>
                      </>
                    )}
                    {stop.status === 'pending' && (
                      <Button size='sm' variant='outline'>
                        View Details
                      </Button>
                    )}
                    {stop.status === 'completed' && (
                      <div className='flex items-center text-green-600 text-sm'>
                        <CheckCircle className='h-4 w-4 mr-1' />
                        Completed
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Route Efficiency */}
      <Card>
        <CardHeader>
          <CardTitle>Route Efficiency</CardTitle>
          <CardDescription>Performance metrics for your current route</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='text-center p-4 border rounded-lg'>
              <Fuel className='h-8 w-8 text-green-600 mx-auto mb-2' />
              <div className='text-xl font-bold'>{routeStats.fuelEfficiency}</div>
              <div className='text-sm text-gray-600'>Fuel Efficiency</div>
            </div>
            <div className='text-center p-4 border rounded-lg'>
              <Route className='h-8 w-8 text-blue-600 mx-auto mb-2' />
              <div className='text-xl font-bold'>{routeStats.optimizationSaving}</div>
              <div className='text-sm text-gray-600'>Time Saved</div>
            </div>
            <div className='text-center p-4 border rounded-lg'>
              <Navigation className='h-8 w-8 text-purple-600 mx-auto mb-2' />
              <div className='text-xl font-bold'>4.8/5</div>
              <div className='text-sm text-gray-600'>Route Rating</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
