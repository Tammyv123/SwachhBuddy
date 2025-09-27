import express from 'express'
import dotenv from 'dotenv'
import {
    setupDefaultMiddlewares,
    requestLogger,
} from '@swachhbuddy/middlewares'

dotenv.config({ quiet: true })

const app = express()
const PORT = Number(process.env.PORT) || 8001
const HOST = process.env.HOST || 'localhost'
const PROTOCOL = process.env.PROTOCOL || 'http'

// Middleware to log requests
app.use(requestLogger)

// requestLogger, cors, cookieParser, express.json, express.urlencoded
setupDefaultMiddlewares(app)

// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 200, message: 'Auth Service is healthy' })
})

app.listen(PORT, HOST, () => {
    console.log(`Auth service running on ${PROTOCOL}://${HOST}:${PORT}`)
})
