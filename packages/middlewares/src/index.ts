import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { logger } from '@swachhbuddy/utils'

export const requestLogger = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    logger.info(`${req.method} ${req.url}`)
    next()
}

export const corsOptions = {
    origin: ['http://localhost:3000'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}

// requestLogger, cors, cookieParser, express.json, express.urlencoded
export const setupDefaultMiddlewares = (app: express.Application) => {
    app.use(requestLogger)
    app.use(cors(corsOptions))
    app.use(express.json({ limit: '10mb' }))
    app.use(express.urlencoded({ limit: '10mb', extended: true }))
    app.use(cookieParser())
}

export { cors, cookieParser }
