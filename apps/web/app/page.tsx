'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Users, Recycle, TrendingUp, Award, Shield, Smartphone } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function HomePage() {
  const [selectedUserType, setSelectedUserType] = useState<string>('')

  const features = [
    {
      icon: <Users className='h-6 w-6' />,
      title: 'Community Engagement',
      description: 'Join millions of Indians in the clean India mission',
      link: '/community-engagement',
    },
    {
      icon: <Recycle className='h-6 w-6' />,
      title: 'Smart Segregation',
      description: 'Learn proper waste sorting with AI-powered guidance',
      link: '/smart-segregation',
    },
    {
      icon: <TrendingUp className='h-6 w-6' />,
      title: 'Progress Tracking',
      description: 'Monitor your environmental impact in real-time',
      link: '/progress-tracking',
    },
    {
      icon: <Award className='h-6 w-6' />,
      title: 'Rewards System',
      description: 'Earn points and rewards for sustainable actions',
      link: '/rewards-system',
    },
    {
      icon: <Shield className='h-6 w-6' />,
      title: 'Transparency',
      description: 'Complete transparency in waste management processes',
      link: '/transparency',
    },
    {
      icon: <Smartphone className='h-6 w-6' />,
      title: 'Digital First',
      description: 'Modern digital solutions for waste management',
      link: '/digital-first',
    },
  ]

  const userTypes = [
    {
      id: 'waste-collector',
      title: 'Waste Collector',
      description: 'Manage collection routes and optimize efficiency',
      icon: '🚛',
    },
    {
      id: 'student',
      title: 'Student',
      description: 'Learn about sustainability and earn rewards',
      icon: '🎓',
    },
    {
      id: 'community-leader',
      title: 'Community Leader',
      description: 'Lead environmental initiatives in your area',
      icon: '👥',
    },
    {
      id: 'employee',
      title: 'Municipal Employee',
      description: 'Monitor and manage waste operations',
      icon: '🏛️',
    },
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50'>
      {/* Navigation */}
      <nav className='bg-white shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between h-16'>
            <div className='flex items-center'>
              <h1 className='text-2xl font-bold text-green-600'>SwachhBuddy</h1>
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
      </nav>

      {/* Hero Section */}
      <section className='pt-20 pb-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className='text-5xl md:text-7xl font-bold text-gray-900 mb-6'>
              Clean India, <span className='text-green-600 block'>Digital Future</span>
            </h1>
            <p className='text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto'>
              Join India&apos;s largest digital waste management platform. Make sustainable choices,
              earn rewards, and build a cleaner tomorrow.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link href='/register'>
                <Button size='lg' className='px-8 py-3 text-lg'>
                  Start Your Journey
                </Button>
              </Link>
              <Link href='/learning'>
                <Button variant='outline' size='lg' className='px-8 py-3 text-lg'>
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className='py-16 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
              Transforming Waste Management
            </h2>
            <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
              Experience the future of waste management with our comprehensive digital platform
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={feature.link}>
                  <Card className='h-full hover:shadow-lg transition-shadow cursor-pointer'>
                    <CardContent className='p-6'>
                      <div className='text-green-600 mb-4'>{feature.icon}</div>
                      <h3 className='text-xl font-semibold mb-2'>{feature.title}</h3>
                      <p className='text-gray-600'>{feature.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className='py-16 bg-green-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>Choose Your Role</h2>
            <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
              Select how you&apos;d like to contribute to a cleaner India
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {userTypes.map((type) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card
                  className={`h-full cursor-pointer transition-all ${
                    selectedUserType === type.id
                      ? 'ring-2 ring-green-500 bg-green-50'
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedUserType(type.id)}
                >
                  <CardContent className='p-6 text-center'>
                    <div className='text-4xl mb-4'>{type.icon}</div>
                    <h3 className='text-lg font-semibold mb-2'>{type.title}</h3>
                    <p className='text-gray-600 text-sm'>{type.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {selectedUserType && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='text-center mt-8'
            >
              <Link href='/register'>
                <Button size='lg' className='px-8 py-3'>
                  Get Started as {userTypes.find((t) => t.id === selectedUserType)?.title}
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-16 bg-green-600 text-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>Ready to Make a Difference?</h2>
          <p className='text-xl mb-8 opacity-90'>
            Join thousands of Indians already making their communities cleaner
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link href='/register'>
              <Button size='lg' variant='secondary' className='px-8 py-3'>
                Sign Up Free
              </Button>
            </Link>
            <Link href='/play'>
              <Button
                size='lg'
                variant='outline'
                className='px-8 py-3 text-white border-white hover:bg-white hover:text-green-600'
              >
                Explore Games
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-gray-900 text-white py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
            <div>
              <h3 className='text-2xl font-bold text-green-400 mb-4'>SwachhBuddy</h3>
              <p className='text-gray-400'>
                Digital India&apos;s waste management platform for a sustainable future.
              </p>
            </div>
            <div>
              <h4 className='text-lg font-semibold mb-4'>Platform</h4>
              <ul className='space-y-2 text-gray-400'>
                <li>
                  <Link href='/play' className='hover:text-white'>
                    Games
                  </Link>
                </li>
                <li>
                  <Link href='/earn' className='hover:text-white'>
                    Earn
                  </Link>
                </li>
                <li>
                  <Link href='/resolve' className='hover:text-white'>
                    Resolve
                  </Link>
                </li>
                <li>
                  <Link href='/learning' className='hover:text-white'>
                    Learning
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className='text-lg font-semibold mb-4'>Features</h4>
              <ul className='space-y-2 text-gray-400'>
                <li>
                  <Link href='/smart-segregation' className='hover:text-white'>
                    Smart Segregation
                  </Link>
                </li>
                <li>
                  <Link href='/rewards-system' className='hover:text-white'>
                    Rewards
                  </Link>
                </li>
                <li>
                  <Link href='/progress-tracking' className='hover:text-white'>
                    Progress Tracking
                  </Link>
                </li>
                <li>
                  <Link href='/community-engagement' className='hover:text-white'>
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className='text-lg font-semibold mb-4'>Support</h4>
              <ul className='space-y-2 text-gray-400'>
                <li>
                  <Link href='/help' className='hover:text-white'>
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href='/contact' className='hover:text-white'>
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href='/privacy' className='hover:text-white'>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href='/terms' className='hover:text-white'>
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className='border-t border-gray-800 mt-8 pt-8 text-center'>
            <p className='text-gray-400'>
              © 2024 SwachhBuddy. All rights reserved. Made with ❤️ for Clean India.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
