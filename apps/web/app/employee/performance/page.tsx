'use client'

import { Button } from '@/components/ui/button'
import PerformanceTracker from '@/components/employee/PerformanceTracker'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PerformancePage() {
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
              <h1 className='text-2xl font-bold text-green-600'>Performance Tracking</h1>
              <p className='text-sm text-gray-600'>Monitor your work performance</p>
            </div>
          </div>
        </div>
      </header>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <PerformanceTracker />
      </div>
    </div>
  )
}
