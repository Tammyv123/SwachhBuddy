'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Upload, Camera, AlertTriangle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function ReportPage() {
  const [reportType, setReportType] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [severity, setSeverity] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 1500)
  }

  if (isSubmitted) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <header className='bg-white shadow-sm border-b'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex items-center py-4'>
              <Link href='/dashboard/employee'>
                <Button variant='ghost' size='sm' className='mr-4'>
                  <ArrowLeft className='h-4 w-4 mr-2' />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className='text-2xl font-bold text-green-600'>Report Submitted</h1>
                <p className='text-sm text-gray-600'>Your report has been submitted successfully</p>
              </div>
            </div>
          </div>
        </header>

        <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <Card>
            <CardContent className='pt-6'>
              <div className='text-center'>
                <CheckCircle className='h-16 w-16 text-green-500 mx-auto mb-4' />
                <h2 className='text-2xl font-bold text-green-600 mb-2'>
                  Report Submitted Successfully!
                </h2>
                <p className='text-gray-600 mb-6'>
                  Your report has been received and assigned ticket #RPT-2024-0157. Our team will
                  review it and take appropriate action.
                </p>
                <div className='flex justify-center space-x-4'>
                  <Button variant='outline' onClick={() => setIsSubmitted(false)}>
                    Submit Another Report
                  </Button>
                  <Link href='/dashboard/employee'>
                    <Button>Return to Dashboard</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center py-4'>
            <Link href='/dashboard/employee'>
              <Button variant='ghost' size='sm' className='mr-4'>
                <ArrowLeft className='h-4 w-4 mr-2' />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className='text-2xl font-bold text-green-600'>Report Issue</h1>
              <p className='text-sm text-gray-600'>
                Report problems or incidents during collection
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <Card>
          <CardHeader>
            <CardTitle>Submit a Report</CardTitle>
            <CardDescription>
              Help us improve waste collection by reporting issues, hazards, or suggestions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Report Type */}
              <div>
                <Label htmlFor='reportType'>Report Type *</Label>
                <Select value={reportType} onValueChange={setReportType} required>
                  <SelectTrigger>
                    <SelectValue placeholder='Select report type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='safety-hazard'>Safety Hazard</SelectItem>
                    <SelectItem value='equipment-malfunction'>Equipment Malfunction</SelectItem>
                    <SelectItem value='route-issue'>Route Issue</SelectItem>
                    <SelectItem value='citizen-complaint'>Citizen Complaint</SelectItem>
                    <SelectItem value='environmental-concern'>Environmental Concern</SelectItem>
                    <SelectItem value='suggestion'>Suggestion for Improvement</SelectItem>
                    <SelectItem value='other'>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Severity */}
              <div>
                <Label htmlFor='severity'>Severity Level *</Label>
                <Select value={severity} onValueChange={setSeverity} required>
                  <SelectTrigger>
                    <SelectValue placeholder='Select severity level' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='low'>
                      Low - Minor issue, no immediate action needed
                    </SelectItem>
                    <SelectItem value='medium'>
                      Medium - Requires attention within 24 hours
                    </SelectItem>
                    <SelectItem value='high'>
                      High - Urgent, requires immediate attention
                    </SelectItem>
                    <SelectItem value='critical'>Critical - Emergency situation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div>
                <Label htmlFor='location'>Location *</Label>
                <Input
                  id='location'
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder='Enter specific location or address'
                  required
                />
                <p className='text-sm text-gray-500 mt-1'>
                  Be as specific as possible (e.g., "Near bin #123, Sector 15, Dwarka")
                </p>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor='description'>Description *</Label>
                <Textarea
                  id='description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder='Provide detailed description of the issue or situation'
                  rows={4}
                  required
                />
                <p className='text-sm text-gray-500 mt-1'>
                  Include what happened, when it occurred, and any immediate actions taken
                </p>
              </div>

              {/* Photo Upload */}
              <div>
                <Label>Attach Photos (Optional)</Label>
                <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center'>
                  <div className='flex flex-col items-center'>
                    <Camera className='h-8 w-8 text-gray-400 mb-2' />
                    <p className='text-sm text-gray-600 mb-2'>
                      Upload photos to help us understand the issue better
                    </p>
                    <div className='flex space-x-2'>
                      <Button type='button' variant='outline' size='sm'>
                        <Upload className='h-4 w-4 mr-2' />
                        Choose Files
                      </Button>
                      <Button type='button' variant='outline' size='sm'>
                        <Camera className='h-4 w-4 mr-2' />
                        Take Photo
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                <h4 className='font-medium text-blue-900 mb-2'>Emergency Contact</h4>
                <p className='text-sm text-blue-800'>
                  For immediate assistance or emergencies, call: <strong>+91-11-1234-5678</strong>
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type='submit'
                className='w-full'
                disabled={isSubmitting || !reportType || !severity || !location || !description}
              >
                {isSubmitting ? 'Submitting Report...' : 'Submit Report'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card className='mt-8'>
          <CardHeader>
            <CardTitle>Your Recent Reports</CardTitle>
            <CardDescription>Track the status of your submitted reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center justify-between p-3 border rounded-lg'>
                <div>
                  <h4 className='font-medium'>Equipment Malfunction</h4>
                  <p className='text-sm text-gray-600'>Truck hydraulic system issue - Sector 12</p>
                  <p className='text-xs text-gray-500'>Submitted on Jan 14, 2024</p>
                </div>
                <div className='text-right'>
                  <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
                    In Progress
                  </span>
                  <p className='text-xs text-gray-500 mt-1'>#RPT-2024-0156</p>
                </div>
              </div>

              <div className='flex items-center justify-between p-3 border rounded-lg'>
                <div>
                  <h4 className='font-medium'>Route Issue</h4>
                  <p className='text-sm text-gray-600'>Road closure affecting pickup schedule</p>
                  <p className='text-xs text-gray-500'>Submitted on Jan 12, 2024</p>
                </div>
                <div className='text-right'>
                  <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                    Resolved
                  </span>
                  <p className='text-xs text-gray-500 mt-1'>#RPT-2024-0155</p>
                </div>
              </div>

              <div className='flex items-center justify-between p-3 border rounded-lg'>
                <div>
                  <h4 className='font-medium'>Safety Hazard</h4>
                  <p className='text-sm text-gray-600'>Broken glass near collection point</p>
                  <p className='text-xs text-gray-500'>Submitted on Jan 10, 2024</p>
                </div>
                <div className='text-right'>
                  <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                    Resolved
                  </span>
                  <p className='text-xs text-gray-500 mt-1'>#RPT-2024-0154</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
