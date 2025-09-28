import { Router } from 'express'
import citizenRoutes from './citizen.route'
import employeeRoutes from './employee.route'
import databaseService from '../services/database.service'

const router = Router()

// Health check route
router.get('/health', async (req, res) => {
    try {
        const dbHealth = await databaseService.healthCheck()

        res.status(200).json({
            success: true,
            message: 'Auth Service is healthy',
            data: {
                service: 'auth-service',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                database: dbHealth,
            },
        })
    } catch (error) {
        res.status(503).json({
            success: false,
            message: 'Auth Service is unhealthy',
            data: {
                service: 'auth-service',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                database: { status: 'error', message: 'Database check failed' },
            },
        })
    }
})

// Auth info route
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'SwachhBuddy Authentication Service',
        data: {
            service: 'auth-service',
            version: '1.0.0',
            timestamp: new Date().toISOString(),
            endpoints: {
                citizens: '/auth/citizens',
                employees: '/auth/employees',
            },
        },
    })
})

// Citizen routes
router.use('/citizens', citizenRoutes)

// Employee routes
router.use('/employees', employeeRoutes)

export default router
