'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Filter,
  Search,
  Calendar,
  Truck,
} from 'lucide-react'

interface Assignment {
  id: string
  area: string
  address: string
  status: 'pending' | 'in-progress' | 'completed'
  priority: 'high' | 'medium' | 'low'
  estimatedTime: string
  wasteType: string
  description: string
  assignedDate: string
  weight?: number
}

interface TaskManagerProps {
  assignments?: Assignment[]
}

export default function TaskManager({ assignments = [] }: TaskManagerProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedTask, setSelectedTask] = useState<Assignment | null>(null)
  const [notes, setNotes] = useState('')

  // Mock data if no assignments provided
  const defaultAssignments: Assignment[] = [
    {
      id: '1',
      area: 'Sector 15, Dwarka',
      address: 'Block A, Sector 15, Dwarka, New Delhi',
      status: 'completed',
      priority: 'high',
      estimatedTime: '09:00 AM',
      wasteType: 'Mixed Waste',
      description: 'Regular household waste collection from residential area',
      assignedDate: '2024-01-15',
      weight: 28.5,
    },
    {
      id: '2',
      area: 'Connaught Place',
      address: 'Central Park, Connaught Place, New Delhi',
      status: 'in-progress',
      priority: 'high',
      estimatedTime: '11:30 AM',
      wasteType: 'E-Waste',
      description: 'Electronic waste collection from commercial establishments',
      assignedDate: '2024-01-15',
    },
    {
      id: '3',
      area: 'Lajpat Nagar Market',
      address: 'Central Market, Lajpat Nagar, New Delhi',
      status: 'pending',
      priority: 'medium',
      estimatedTime: '02:00 PM',
      wasteType: 'Organic Waste',
      description: 'Market waste collection - vegetables and organic matter',
      assignedDate: '2024-01-15',
    },
    {
      id: '4',
      area: 'Karol Bagh',
      address: 'Main Market, Karol Bagh, New Delhi',
      status: 'pending',
      priority: 'low',
      estimatedTime: '04:30 PM',
      wasteType: 'Recyclable',
      description: 'Plastic and paper waste collection from shops',
      assignedDate: '2024-01-15',
    },
  ]

  const taskList = assignments.length > 0 ? assignments : defaultAssignments

  const filteredTasks = taskList.filter((task) => {
    const matchesSearch =
      task.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.wasteType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    return matchesSearch && matchesStatus
  })

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

  const updateTaskStatus = (taskId: string, newStatus: 'pending' | 'in-progress' | 'completed') => {
    // In a real app, this would update the backend
    console.log(`Updating task ${taskId} to ${newStatus}`)
  }

  return (
    <div className='space-y-6'>
      {/* Header and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Task Manager</CardTitle>
          <CardDescription>Manage your waste collection assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col sm:flex-row gap-4 mb-4'>
            <div className='flex-1'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                <Input
                  placeholder='Search by area or waste type...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-10'
                />
              </div>
            </div>
            <div className='flex gap-2'>
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setStatusFilter('all')}
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'pending' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setStatusFilter('pending')}
              >
                Pending
              </Button>
              <Button
                variant={statusFilter === 'in-progress' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setStatusFilter('in-progress')}
              >
                In Progress
              </Button>
              <Button
                variant={statusFilter === 'completed' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setStatusFilter('completed')}
              >
                Completed
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Assignments ({filteredTasks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className='border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer'
                onClick={() => setSelectedTask(task)}
              >
                <div className='flex items-start justify-between'>
                  <div className='flex items-start space-x-4'>
                    <div className='p-2 rounded-lg bg-gray-100'>
                      <MapPin className='h-4 w-4 text-gray-600' />
                    </div>
                    <div className='flex-1'>
                      <h3 className='font-medium'>{task.area}</h3>
                      <p className='text-sm text-gray-600'>{task.address}</p>
                      <p className='text-sm text-gray-500 mt-1'>{task.description}</p>
                      <div className='flex items-center space-x-4 mt-2'>
                        <div className='flex items-center space-x-1'>
                          <Clock className='h-3 w-3 text-gray-400' />
                          <span className='text-xs text-gray-500'>{task.estimatedTime}</span>
                        </div>
                        <div className='flex items-center space-x-1'>
                          <Truck className='h-3 w-3 text-gray-400' />
                          <span className='text-xs text-gray-500'>{task.wasteType}</span>
                        </div>
                        {task.weight && (
                          <div className='flex items-center space-x-1'>
                            <span className='text-xs text-gray-500'>
                              {task.weight} kg collected
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-col items-end space-y-2'>
                    <Badge className={getStatusColor(task.status)}>
                      {task.status.replace('-', ' ')}
                    </Badge>
                    <Badge variant='outline' className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                </div>

                {/* Action buttons */}
                <div className='flex justify-end space-x-2 mt-3 pt-3 border-t'>
                  {task.status === 'pending' && (
                    <Button
                      size='sm'
                      onClick={(e) => {
                        e.stopPropagation()
                        updateTaskStatus(task.id, 'in-progress')
                      }}
                    >
                      Start Task
                    </Button>
                  )}
                  {task.status === 'in-progress' && (
                    <Button
                      size='sm'
                      onClick={(e) => {
                        e.stopPropagation()
                        updateTaskStatus(task.id, 'completed')
                      }}
                    >
                      Mark Complete
                    </Button>
                  )}
                  {task.status === 'completed' && (
                    <div className='flex items-center text-green-600'>
                      <CheckCircle className='h-4 w-4 mr-1' />
                      <span className='text-sm'>Completed</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {filteredTasks.length === 0 && (
              <div className='text-center py-8 text-gray-500'>
                No tasks found matching your criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Task Detail Modal */}
      {selectedTask && (
        <Card className='border-blue-200'>
          <CardHeader>
            <div className='flex justify-between items-start'>
              <div>
                <CardTitle>Task Details</CardTitle>
                <CardDescription>{selectedTask.area}</CardDescription>
              </div>
              <Button variant='outline' size='sm' onClick={() => setSelectedTask(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <h4 className='font-medium mb-2'>Location Information</h4>
                <p className='text-sm text-gray-600 mb-1'>
                  <strong>Area:</strong> {selectedTask.area}
                </p>
                <p className='text-sm text-gray-600 mb-1'>
                  <strong>Address:</strong> {selectedTask.address}
                </p>
                <p className='text-sm text-gray-600 mb-1'>
                  <strong>Scheduled Time:</strong> {selectedTask.estimatedTime}
                </p>
              </div>
              <div>
                <h4 className='font-medium mb-2'>Task Information</h4>
                <p className='text-sm text-gray-600 mb-1'>
                  <strong>Waste Type:</strong> {selectedTask.wasteType}
                </p>
                <p className='text-sm text-gray-600 mb-1'>
                  <strong>Priority:</strong> {selectedTask.priority}
                </p>
                <p className='text-sm text-gray-600 mb-1'>
                  <strong>Status:</strong> {selectedTask.status}
                </p>
              </div>
            </div>
            <div className='mt-4'>
              <h4 className='font-medium mb-2'>Description</h4>
              <p className='text-sm text-gray-600'>{selectedTask.description}</p>
            </div>

            {/* Notes section */}
            <div className='mt-4'>
              <h4 className='font-medium mb-2'>Add Notes</h4>
              <Textarea
                placeholder='Add notes about this collection...'
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className='mb-2'
              />
              <Button size='sm'>Save Notes</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
