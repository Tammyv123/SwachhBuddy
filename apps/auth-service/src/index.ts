import dotenv from 'dotenv'
import path from 'path'

// Load environment variables with explicit path
dotenv.config({
    path: path.resolve(__dirname, '..', '.env'),
    quiet: true,
})

import express from 'express'

import { logger } from '@swachhbuddy/utils'
import { setupDefaultMiddlewares, requestLogger } from '@swachhbuddy/middlewares'
import databaseService from './services/database.service'
import authRoutes from './routes/index'

const app = express()
const PORT = Number(process.env.PORT) || 6001
const HOST = process.env.HOST || 'localhost'
const PROTOCOL = process.env.PROTOCOL || 'http'

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET']

const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName])
if (missingEnvVars.length > 0) {
    logger.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`)
    process.exit(1)
}

// Middleware to log requests
app.use(requestLogger)

// Setup default middlewares (requestLogger, cors, cookieParser, express.json, express.urlencoded)
setupDefaultMiddlewares(app)

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error('Unhandled error:', err)
    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    })
})

// Connect to database
async function connectDatabase() {
    try {
        await databaseService.connect()
        // logger.info('Database connection skipped for testing')
    } catch (error) {
        logger.error('Failed to connect to database:', error)
        process.exit(1)
    }
}

// Health check route (before auth routes to avoid middleware)
app.get('/health', async (req, res) => {
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

// Mount auth routes
app.use('/auth', authRoutes)

// Catch-all route for undefined endpoints
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    })
})

// Global error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error('Global error handler:', error)

    if (res.headersSent) {
        return next(error)
    }

    res.status(error.status || 500).json({
        success: false,
        message: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    })
})

// Start server
async function startServer() {
    try {
        // Connect to database first
        await connectDatabase()

        // Start the server
        const server = app.listen(PORT, HOST, () => {
            logger.info(`🚀 Auth service running on ${PROTOCOL}://${HOST}:${PORT}`)
            logger.info(`📊 Health check: ${PROTOCOL}://${HOST}:${PORT}/health`)
            logger.info(`🔐 Auth endpoints: ${PROTOCOL}://${HOST}:${PORT}/auth`)
        })

        // Graceful shutdown
        process.on('SIGTERM', async () => {
            logger.info('SIGTERM received, shutting down gracefully')

            server.close(async () => {
                logger.info('HTTP server closed')

                try {
                    await databaseService.disconnect()
                    logger.info('Database disconnected')
                } catch (error) {
                    logger.error('Error disconnecting from database:', error)
                }

                process.exit(0)
            })
        })

        process.on('SIGINT', async () => {
            logger.info('SIGINT received, shutting down gracefully')

            server.close(async () => {
                logger.info('HTTP server closed')

                try {
                    await databaseService.disconnect()
                    logger.info('Database disconnected')
                } catch (error) {
                    logger.error('Error disconnecting from database:', error)
                }

                process.exit(0)
            })
        })

        // Handle uncaught exceptions
        process.on('uncaughtException', (error) => {
            logger.error('Uncaught Exception:', error)
            process.exit(1)
        })

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (reason, promise) => {
            logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
            process.exit(1)
        })
    } catch (error) {
        logger.error('Failed to start server:', error)
        process.exit(1)
    }
}

// Start the application
startServer()
