import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import proxy from 'express-http-proxy'
import { logger } from '@swachhbuddy/utils'
import { setupDefaultMiddlewares } from '@swachhbuddy/middlewares'

dotenv.config({ quiet: true })

const app = express()
const PORT = Number(process.env.PORT) || 8000
const HOST = process.env.HOST || 'localhost'

// requestLogger, cors, cookieParser, express.json, express.urlencoded
setupDefaultMiddlewares(app)

// Rate limiting middleware
const limit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: (req: any) => (req.user ? 1000 : 100), // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(
    cors({
        origin: ['http://localhost:3000'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
)

app.use(limit)

// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 200, message: 'API Gateway is healthy' })
})

// Proxy routes
app.use('/auth', proxy('http://localhost:8001')) // Auth Service

const server = app.listen(PORT, HOST, () => {
    logger.info(`API Gateway is running on http://${HOST}:${PORT}`)
})

server.on('error', console.error)
