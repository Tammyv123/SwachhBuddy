import 'dotenv/config'
import jwt, { SignOptions } from 'jsonwebtoken'
import { Request, Response } from 'express'
import User, { IUser } from '../models/User'
import { logger } from '@swachhbuddy/utils'

export interface TokenPayload {
    userId: string
    email: string
    role: string
    iat?: number
    exp?: number
}

export interface AuthTokens {
    accessToken: string
    refreshToken: string
}

class AuthService {
    private readonly ACCESS_TOKEN_SECRET: string
    private readonly REFRESH_TOKEN_SECRET: string
    private readonly ACCESS_TOKEN_EXPIRES_IN: string
    private readonly REFRESH_TOKEN_EXPIRES_IN: string

    constructor() {
        this.ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET!
        this.REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET!
        this.ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m'
        this.REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d'

        if (!this.ACCESS_TOKEN_SECRET || !this.REFRESH_TOKEN_SECRET) {
            throw new Error('JWT secrets are not configured')
        }
    }

    /**
     * Generate access token
     */
    generateAccessToken(user: IUser): string {
        const payload: TokenPayload = {
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        }

        return jwt.sign(payload, this.ACCESS_TOKEN_SECRET, {
            expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
            issuer: 'swachhbuddy-auth',
            audience: 'swachhbuddy-api',
        } as any)
    }

    /**
     * Generate refresh token
     */
    generateRefreshToken(user: IUser): string {
        const payload: TokenPayload = {
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        }

        return jwt.sign(payload, this.REFRESH_TOKEN_SECRET, {
            expiresIn: this.REFRESH_TOKEN_EXPIRES_IN,
            issuer: 'swachhbuddy-auth',
            audience: 'swachhbuddy-api',
        } as any)
    }

    /**
     * Generate both access and refresh tokens
     */
    generateTokens(user: IUser): AuthTokens {
        const accessToken = this.generateAccessToken(user)
        const refreshToken = this.generateRefreshToken(user)

        return {
            accessToken,
            refreshToken,
        }
    }

    /**
     * Verify access token
     */
    verifyAccessToken(token: string): TokenPayload {
        try {
            const decoded = jwt.verify(token, this.ACCESS_TOKEN_SECRET) as TokenPayload
            return decoded
        } catch (error) {
            logger.error('Access token verification failed:', error)
            throw new Error('Invalid access token')
        }
    }

    /**
     * Verify refresh token
     */
    verifyRefreshToken(token: string): TokenPayload {
        try {
            const decoded = jwt.verify(token, this.REFRESH_TOKEN_SECRET) as TokenPayload
            return decoded
        } catch (error) {
            logger.error('Refresh token verification failed:', error)
            throw new Error('Invalid refresh token')
        }
    }

    /**
     * Extract token from Authorization header
     */
    extractTokenFromHeader(req: Request): string | null {
        const authorization = req.headers.authorization

        if (!authorization) {
            return null
        }

        const parts = authorization.split(' ')
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return null
        }

        return parts[1]
    }

    /**
     * Set authentication cookies
     */
    setAuthCookies(res: Response, tokens: AuthTokens): void {
        // Set access token in memory (shorter expiry)
        res.cookie('accessToken', tokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15 minutes
        })

        // Set refresh token (longer expiry)
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
    }

    /**
     * Clear authentication cookies
     */
    clearAuthCookies(res: Response): void {
        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')
    }

    /**
     * Validate password strength
     */
    validatePassword(password: string): { isValid: boolean; errors: string[] } {
        const errors: string[] = []

        if (password.length < 8) {
            errors.push('Password must be at least 8 characters long')
        }

        if (!/(?=.*[a-z])/.test(password)) {
            errors.push('Password must contain at least one lowercase letter')
        }

        if (!/(?=.*[A-Z])/.test(password)) {
            errors.push('Password must contain at least one uppercase letter')
        }

        if (!/(?=.*\d)/.test(password)) {
            errors.push('Password must contain at least one number')
        }

        if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
            errors.push('Password must contain at least one special character')
        }

        return {
            isValid: errors.length === 0,
            errors,
        }
    }

    /**
     * Sanitize user object for response
     */
    sanitizeUser(user: IUser): Partial<IUser> {
        const userObject = user.toObject ? user.toObject() : user
        const { password, refreshToken, __v, ...sanitizedUser } = userObject

        return sanitizedUser
    }

    /**
     * Check if user account is active
     */
    isUserActive(user: IUser): boolean {
        return user.status === 'active'
    }

    /**
     * Update user last login
     */
    async updateLastLogin(userId: string): Promise<void> {
        try {
            await User.findByIdAndUpdate(userId, {
                lastLogin: new Date(),
            })
        } catch (error) {
            logger.error('Failed to update last login:', error)
            // Don't throw error as this is not critical
        }
    }

    /**
     * Store refresh token in database
     */
    async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
        try {
            await User.findByIdAndUpdate(userId, {
                refreshToken: refreshToken,
            })
        } catch (error) {
            logger.error('Failed to store refresh token:', error)
            throw new Error('Failed to store refresh token')
        }
    }

    /**
     * Remove refresh token from database
     */
    async removeRefreshToken(userId: string): Promise<void> {
        try {
            await User.findByIdAndUpdate(userId, {
                $unset: { refreshToken: 1 },
            })
        } catch (error) {
            logger.error('Failed to remove refresh token:', error)
            // Don't throw error as this is not critical during logout
        }
    }
}

// Export singleton instance
export const authService = new AuthService()
export default authService
