import { Request, Response, NextFunction } from 'express'
import authService from '../services/auth.service'
import User, { UserRole } from '../models/User'
import { logger } from '@swachhbuddy/utils'

// Extend the Request interface to include user property
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string
                email: string
                role: UserRole
            }
        }
    }
}

export interface AuthRequest extends Request {
    user: {
        userId: string
        email: string
        role: UserRole
    }
}

/**
 * Middleware to authenticate JWT token
 */
export const authenticateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Try to get token from Authorization header first, then from cookies
        let token = authService.extractTokenFromHeader(req)

        if (!token) {
            token = req.cookies?.accessToken
        }

        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Access token is required',
            })
            return
        }

        // Verify token
        const decoded = authService.verifyAccessToken(token)

        // Check if user still exists and is active
        const user = await User.findOne({
            _id: decoded.userId,
            status: 'active',
        })

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'User not found or inactive',
            })
            return
        }

        // Attach user info to request
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role as UserRole,
        }

        next()
    } catch (error: any) {
        logger.error('Token authentication error:', error)
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
        })
    }
}

/**
 * Middleware to check if user has required role
 */
export const requireRole = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required',
            })
            return
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: 'Insufficient permissions',
            })
            return
        }

        next()
    }
}

/**
 * Middleware to check if user is a citizen
 */
export const requireCitizen = requireRole(UserRole.CITIZEN)

/**
 * Middleware to check if user is an employee
 */
export const requireEmployee = requireRole(UserRole.EMPLOYEE)

/**
 * Middleware to check if user is either citizen or employee
 */
export const requireAuth = requireRole(UserRole.CITIZEN, UserRole.EMPLOYEE)

/**
 * Optional authentication middleware (doesn't fail if no token)
 */
export const optionalAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Try to get token from Authorization header first, then from cookies
        let token = authService.extractTokenFromHeader(req)

        if (!token) {
            token = req.cookies?.accessToken
        }

        if (!token) {
            // No token provided, continue without authentication
            next()
            return
        }

        // Verify token
        const decoded = authService.verifyAccessToken(token)

        // Check if user still exists and is active
        const user = await User.findOne({
            _id: decoded.userId,
            status: 'active',
        })

        if (user) {
            // Attach user info to request
            req.user = {
                userId: decoded.userId,
                email: decoded.email,
                role: decoded.role as UserRole,
            }
        }

        next()
    } catch (error: any) {
        // Silent fail for optional auth
        logger.warn('Optional auth failed:', error.message)
        next()
    }
}

/**
 * Middleware to validate request body against required fields
 */
export const validateRequiredFields = (requiredFields: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const missingFields = requiredFields.filter((field) => !req.body[field])

        if (missingFields.length > 0) {
            res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`,
            })
            return
        }

        next()
    }
}

/**
 * Middleware to sanitize request body (remove sensitive fields)
 */
export const sanitizeBody = (sensitiveFields: string[] = ['password', 'refreshToken']) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        // Create a copy of the body without sensitive fields in logs
        const sanitizedBody = { ...req.body }
        sensitiveFields.forEach((field) => {
            if (sanitizedBody[field]) {
                sanitizedBody[field] = '[REDACTED]'
            }
        })

        // Log the request with sanitized body
        logger.info(`${req.method} ${req.originalUrl}`, { body: sanitizedBody })

        next()
    }
}

export default {
    authenticateToken,
    requireRole,
    requireCitizen,
    requireEmployee,
    requireAuth,
    optionalAuth,
    validateRequiredFields,
    sanitizeBody,
}
