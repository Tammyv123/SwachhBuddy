import { Request, Response } from 'express'
import citizenService from '../services/citizen.service'
import authService from '../services/auth.service'
import User from '../models/User'
import { logger } from '@swachhbuddy/utils'

export class CitizenController {
    /**
     * Register a new citizen
     */
    async register(req: Request, res: Response): Promise<void> {
        try {
            const registrationData = req.body

            // Basic validation
            const requiredFields = ['email', 'password', 'firstName', 'lastName']
            const missingFields = requiredFields.filter((field) => !registrationData[field])

            if (missingFields.length > 0) {
                res.status(400).json({
                    success: false,
                    message: `Missing required fields: ${missingFields.join(', ')}`,
                })
                return
            }

            const result = await citizenService.registerCitizen(registrationData)

            // Set auth cookies
            authService.setAuthCookies(res, result.tokens)

            res.status(201).json({
                success: true,
                message: 'Citizen registered successfully',
                data: {
                    user: result.user,
                    accessToken: result.tokens.accessToken,
                },
            })
        } catch (error: any) {
            logger.error('Citizen registration error:', error)
            res.status(400).json({
                success: false,
                message: error.message || 'Registration failed',
            })
        }
    }

    /**
     * Login a citizen
     */
    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body

            if (!email || !password) {
                res.status(400).json({
                    success: false,
                    message: 'Email and password are required',
                })
                return
            }

            const result = await citizenService.loginCitizen({ email, password })

            // Set auth cookies
            authService.setAuthCookies(res, result.tokens)

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    user: result.user,
                    accessToken: result.tokens.accessToken,
                },
            })
        } catch (error: any) {
            logger.error('Citizen login error:', error)
            res.status(401).json({
                success: false,
                message: error.message || 'Login failed',
            })
        }
    }

    /**
     * Logout a citizen
     */
    async logout(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId

            if (userId) {
                // Remove refresh token from database
                await authService.removeRefreshToken(userId)
            }

            // Clear auth cookies
            authService.clearAuthCookies(res)

            res.status(200).json({
                success: true,
                message: 'Logout successful',
            })
        } catch (error: any) {
            logger.error('Citizen logout error:', error)
            // Even if there's an error, clear cookies and respond success
            authService.clearAuthCookies(res)
            res.status(200).json({
                success: true,
                message: 'Logout successful',
            })
        }
    }

    /**
     * Refresh access token
     */
    async refreshToken(req: Request, res: Response): Promise<void> {
        try {
            const refreshToken = req.cookies.refreshToken

            if (!refreshToken) {
                res.status(401).json({
                    success: false,
                    message: 'Refresh token not provided',
                })
                return
            }

            // Verify refresh token
            const decoded = authService.verifyRefreshToken(refreshToken)

            // Get user from database
            const user = await User.findOne({
                _id: decoded.userId,
                refreshToken: refreshToken,
                status: 'active',
            })

            if (!user) {
                res.status(401).json({
                    success: false,
                    message: 'Invalid refresh token',
                })
                return
            }

            // Generate new tokens
            const tokens = authService.generateTokens(user)

            // Store new refresh token
            await authService.storeRefreshToken(user._id.toString(), tokens.refreshToken)

            // Set new auth cookies
            authService.setAuthCookies(res, tokens)

            res.status(200).json({
                success: true,
                message: 'Token refreshed successfully',
                data: {
                    accessToken: tokens.accessToken,
                },
            })
        } catch (error: any) {
            logger.error('Token refresh error:', error)
            res.status(401).json({
                success: false,
                message: 'Token refresh failed',
            })
        }
    }

    /**
     * Get current citizen profile
     */
    async getProfile(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId

            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                })
                return
            }

            const profile = await citizenService.getCitizenProfile(userId)

            res.status(200).json({
                success: true,
                message: 'Profile retrieved successfully',
                data: { user: profile },
            })
        } catch (error: any) {
            logger.error('Get citizen profile error:', error)
            res.status(404).json({
                success: false,
                message: error.message || 'Profile not found',
            })
        }
    }

    /**
     * Update citizen profile
     */
    async updateProfile(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId
            const updateData = req.body

            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                })
                return
            }

            // Remove fields that shouldn't be updated via this endpoint
            delete updateData.email
            delete updateData.password
            delete updateData.role
            delete updateData.status

            const updatedProfile = await citizenService.updateCitizenProfile(userId, updateData)

            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: { user: updatedProfile },
            })
        } catch (error: any) {
            logger.error('Update citizen profile error:', error)
            res.status(400).json({
                success: false,
                message: error.message || 'Profile update failed',
            })
        }
    }

    /**
     * Change citizen password
     */
    async changePassword(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId
            const { currentPassword, newPassword } = req.body

            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                })
                return
            }

            if (!currentPassword || !newPassword) {
                res.status(400).json({
                    success: false,
                    message: 'Current password and new password are required',
                })
                return
            }

            await citizenService.changeCitizenPassword(userId, currentPassword, newPassword)

            // Clear all auth cookies to force re-login
            authService.clearAuthCookies(res)

            res.status(200).json({
                success: true,
                message: 'Password changed successfully. Please login again.',
            })
        } catch (error: any) {
            logger.error('Change citizen password error:', error)
            res.status(400).json({
                success: false,
                message: error.message || 'Password change failed',
            })
        }
    }

    /**
     * Deactivate citizen account
     */
    async deactivateAccount(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId

            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                })
                return
            }

            await citizenService.deactivateCitizen(userId)

            // Clear auth cookies
            authService.clearAuthCookies(res)

            res.status(200).json({
                success: true,
                message: 'Account deactivated successfully',
            })
        } catch (error: any) {
            logger.error('Deactivate citizen account error:', error)
            res.status(400).json({
                success: false,
                message: error.message || 'Account deactivation failed',
            })
        }
    }

    /**
     * Get citizens by location (for admin/employee use)
     */
    async getCitizensByLocation(req: Request, res: Response): Promise<void> {
        try {
            const { city, state } = req.query

            if (!city) {
                res.status(400).json({
                    success: false,
                    message: 'City parameter is required',
                })
                return
            }

            const citizens = await citizenService.getCitizensByLocation(
                city as string,
                state as string
            )

            res.status(200).json({
                success: true,
                message: 'Citizens retrieved successfully',
                data: { citizens },
            })
        } catch (error: any) {
            logger.error('Get citizens by location error:', error)
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to get citizens',
            })
        }
    }
}

// Export singleton instance
export const citizenController = new CitizenController()
export default citizenController
