import mongoose from 'mongoose'
import { logger } from '@swachhbuddy/utils'

class DatabaseService {
    private static instance: DatabaseService
    private isConnected: boolean = false

    private constructor() {}

    static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService()
        }
        return DatabaseService.instance
    }

    async connect(): Promise<void> {
        if (this.isConnected) {
            logger.info('Already connected to MongoDB')
            return
        }

        const mongoUri = process.env.MONGODB_URI

        if (!mongoUri) {
            throw new Error('MONGODB_URI environment variable is not set')
        }

        try {
            // Configure mongoose options
            const options = {
                maxPoolSize: 10, // Maintain up to 10 socket connections
                serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
                socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
                bufferCommands: false, // Disable mongoose buffering
                retryWrites: true, // Enable retryable writes
            }

            await mongoose.connect(mongoUri, options)

            this.isConnected = true
            logger.info('Successfully connected to MongoDB')

            // Handle connection events
            mongoose.connection.on('error', (error) => {
                logger.error('MongoDB connection error:', error)
                this.isConnected = false
            })

            mongoose.connection.on('disconnected', () => {
                logger.warn('MongoDB disconnected')
                this.isConnected = false
            })

            mongoose.connection.on('reconnected', () => {
                logger.info('MongoDB reconnected')
                this.isConnected = true
            })

            // Handle process termination
            process.on('SIGINT', async () => {
                await this.disconnect()
                process.exit(0)
            })

            process.on('SIGTERM', async () => {
                await this.disconnect()
                process.exit(0)
            })
        } catch (error) {
            logger.error('Failed to connect to MongoDB:', error)
            throw error
        }
    }

    async disconnect(): Promise<void> {
        if (!this.isConnected) {
            return
        }

        try {
            await mongoose.connection.close()
            this.isConnected = false
            logger.info('Disconnected from MongoDB')
        } catch (error) {
            logger.error('Error disconnecting from MongoDB:', error)
            throw error
        }
    }

    getConnectionStatus(): boolean {
        return this.isConnected
    }

    async healthCheck(): Promise<{ status: string; message: string }> {
        try {
            if (!this.isConnected) {
                return {
                    status: 'error',
                    message: 'Not connected to database',
                }
            }

            // Try to ping the database
            if (mongoose.connection.db) {
                await mongoose.connection.db.admin().ping()
            } else {
                throw new Error('Database connection not available')
            }

            return {
                status: 'healthy',
                message: 'Database connection is healthy',
            }
        } catch (error) {
            logger.error('Database health check failed:', error)
            return {
                status: 'error',
                message: 'Database health check failed',
            }
        }
    }
}

// Export singleton instance
export const databaseService = DatabaseService.getInstance()
export default databaseService
