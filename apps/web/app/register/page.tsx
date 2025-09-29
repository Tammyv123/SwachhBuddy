'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    // Employee-specific fields
    employeeType: '',
    employeeId: '',
    department: '',
  })
  const [userType, setUserType] = useState<'citizen' | 'employee'>('citizen')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleUserTypeChange = (newUserType: 'citizen' | 'employee') => {
    setUserType(newUserType)
    // Clear employee-specific fields when switching to citizen
    if (newUserType === 'citizen') {
      setFormData({
        ...formData,
        employeeType: '',
        employeeId: '',
        department: '',
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    // Validate employee-specific fields
    if (userType === 'employee') {
      if (!formData.employeeType || !formData.employeeId || !formData.department) {
        setError('Please fill in all employee fields: Employee Type, Employee ID, and Department')
        setLoading(false)
        return
      }
    }

    try {
      const { confirmPassword, ...submitData } = formData

      // Only include employee fields if user is registering as employee
      let finalSubmitData: any = submitData
      if (userType === 'citizen') {
        const { employeeType, employeeId, department, ...citizenData } = submitData
        finalSubmitData = citizenData
      }

      const response = await fetch(`/api/auth/${userType}s/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalSubmitData),
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        // Store user data
        localStorage.setItem('user', JSON.stringify(data.data.user))
        localStorage.setItem('accessToken', data.data.accessToken)

        // Redirect based on user type
        if (userType === 'citizen') {
          router.push('/dashboard/citizen')
        } else {
          router.push('/dashboard/employee')
        }
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Registration failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl font-bold text-green-600'>Join SwachhBuddy</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label>User Type</Label>
              <div className='flex space-x-4'>
                <Button
                  type='button'
                  variant={userType === 'citizen' ? 'default' : 'outline'}
                  onClick={() => handleUserTypeChange('citizen')}
                  className='flex-1'
                >
                  Citizen
                </Button>
                <Button
                  type='button'
                  variant={userType === 'employee' ? 'default' : 'outline'}
                  onClick={() => handleUserTypeChange('employee')}
                  className='flex-1'
                >
                  Employee
                </Button>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='firstName'>First Name</Label>
                <Input
                  id='firstName'
                  name='firstName'
                  placeholder='First name'
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='lastName'>Last Name</Label>
                <Input
                  id='lastName'
                  name='lastName'
                  placeholder='Last name'
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                name='email'
                type='email'
                placeholder='Enter your email'
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='phoneNumber'>Phone Number</Label>
              <Input
                id='phoneNumber'
                name='phoneNumber'
                type='tel'
                placeholder='Enter your phone number'
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            {/* Employee-specific fields */}
            {userType === 'employee' && (
              <>
                <div className='space-y-2'>
                  <Label htmlFor='employeeType'>Employee Type</Label>
                  <Select
                    value={formData.employeeType}
                    onValueChange={(value) => handleSelectChange('employeeType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select employee type' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='waste_collector'>Waste Collector</SelectItem>
                      <SelectItem value='supervisor'>Supervisor</SelectItem>
                      <SelectItem value='admin'>Admin</SelectItem>
                      <SelectItem value='driver'>Driver</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='employeeId'>Employee ID</Label>
                  <Input
                    id='employeeId'
                    name='employeeId'
                    placeholder='Enter your employee ID'
                    value={formData.employeeId}
                    onChange={handleChange}
                    required={userType === 'employee'}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='department'>Department</Label>
                  <Input
                    id='department'
                    name='department'
                    placeholder='Enter your department'
                    value={formData.department}
                    onChange={handleChange}
                    required={userType === 'employee'}
                  />
                </div>
              </>
            )}

            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                name='password'
                type='password'
                placeholder='Create a password'
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Confirm Password</Label>
              <Input
                id='confirmPassword'
                name='confirmPassword'
                type='password'
                placeholder='Confirm your password'
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {error && (
              <Alert variant='destructive'>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type='submit' className='w-full' disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className='text-center'>
          <p className='text-sm text-gray-600'>
            Already have an account?{' '}
            <Link href='/login' className='text-green-600 hover:underline'>
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
