import { Request, Response } from 'express'
import employeeService from '../services/employee.service'
import authService from '../services/auth.service'
import User, { EmployeeType } from '../models/User'
import { logger } from '@swachhbuddy/utils'

export class EmployeeController {
    /**
     * Register a new employee
     */
    async register(req: Request, res: Response): Promise<void> {
        try {
            const registrationData = req.body

            // Basic validation
            const requiredFields = [
                'email',
                'password',
                'firstName',
                'lastName',
                'employeeType',
                'employeeId',
                'department',
            ]
            const missingFields = requiredFields.filter((field) => !registrationData[field])

            if (missingFields.length > 0) {
                res.status(400).json({
                    success: false,
                    message: `Missing required fields: ${missingFields.join(', ')}`,
                })
                return
            }

            const result = await employeeService.registerEmployee(registrationData)

            // Set auth cookies
            authService.setAuthCookies(res, result.tokens)

            res.status(201).json({
                success: true,
                message: 'Employee registered successfully',
                data: {
                    user: result.user,
                    accessToken: result.tokens.accessToken,
                },
            })
        } catch (error: any) {
            logger.error('Employee registration error:', error)
            res.status(400).json({
                success: false,
                message: error.message || 'Registration failed',
            })
        }
    }

    /**
     * Login an employee
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

            const result = await employeeService.loginEmployee({ email, password })

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
            logger.error('Employee login error:', error)
            res.status(401).json({
                success: false,
                message: error.message || 'Login failed',
            })
        }
    }

    /**
     * Logout an employee
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
            logger.error('Employee logout error:', error)
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
     * Get current employee profile
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

            const profile = await employeeService.getEmployeeProfile(userId)

            res.status(200).json({
                success: true,
                message: 'Profile retrieved successfully',
                data: { user: profile },
            })
        } catch (error: any) {
            logger.error('Get employee profile error:', error)
            res.status(404).json({
                success: false,
                message: error.message || 'Profile not found',
            })
        }
    }

    /**
     * Update employee profile
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
            delete updateData.employeeId
            delete updateData.employeeType

            const updatedProfile = await employeeService.updateEmployeeProfile(userId, updateData)

            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: { user: updatedProfile },
            })
        } catch (error: any) {
            logger.error('Update employee profile error:', error)
            res.status(400).json({
                success: false,
                message: error.message || 'Profile update failed',
            })
        }
    }

    /**
     * Change employee password
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

            await employeeService.changeEmployeePassword(userId, currentPassword, newPassword)

            // Clear all auth cookies to force re-login
            authService.clearAuthCookies(res)

            res.status(200).json({
                success: true,
                message: 'Password changed successfully. Please login again.',
            })
        } catch (error: any) {
            logger.error('Change employee password error:', error)
            res.status(400).json({
                success: false,
                message: error.message || 'Password change failed',
            })
        }
    }

    /**
     * Get employees by department
     */
    async getEmployeesByDepartment(req: Request, res: Response): Promise<void> {
        try {
            const { department, employeeType } = req.query

            if (!department) {
                res.status(400).json({
                    success: false,
                    message: 'Department parameter is required',
                })
                return
            }

            const employees = await employeeService.getEmployeesByDepartment(
                department as string,
                employeeType as EmployeeType
            )

            res.status(200).json({
                success: true,
                message: 'Employees retrieved successfully',
                data: { employees },
            })
        } catch (error: any) {
            logger.error('Get employees by department error:', error)
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to get employees',
            })
        }
    }

    /**
     * Get employees by assigned area
     */
    async getEmployeesByArea(req: Request, res: Response): Promise<void> {
        try {
            const { area } = req.query

            if (!area) {
                res.status(400).json({
                    success: false,
                    message: 'Area parameter is required',
                })
                return
            }

            const employees = await employeeService.getEmployeesByArea(area as string)

            res.status(200).json({
                success: true,
                message: 'Employees retrieved successfully',
                data: { employees },
            })
        } catch (error: any) {
            logger.error('Get employees by area error:', error)
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to get employees',
            })
        }
    }

    /**
     * Get subordinates (for supervisors)
     */
    async getSubordinates(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId

            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                })
                return
            }

            const subordinates = await employeeService.getSubordinates(userId)

            res.status(200).json({
                success: true,
                message: 'Subordinates retrieved successfully',
                data: { subordinates },
            })
        } catch (error: any) {
            logger.error('Get subordinates error:', error)
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to get subordinates',
            })
        }
    }

    /**
     * Suspend employee (admin only)
     */
    async suspendEmployee(req: Request, res: Response): Promise<void> {
        try {
            const { employeeId } = req.params

            if (!employeeId) {
                res.status(400).json({
                    success: false,
                    message: 'Employee ID is required',
                })
                return
            }

            await employeeService.suspendEmployee(employeeId)

            res.status(200).json({
                success: true,
                message: 'Employee suspended successfully',
            })
        } catch (error: any) {
            logger.error('Suspend employee error:', error)
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to suspend employee',
            })
        }
    }

    /**
     * Reactivate employee (admin only)
     */
    async reactivateEmployee(req: Request, res: Response): Promise<void> {
        try {
            const { employeeId } = req.params

            if (!employeeId) {
                res.status(400).json({
                    success: false,
                    message: 'Employee ID is required',
                })
                return
            }

            await employeeService.reactivateEmployee(employeeId)

            res.status(200).json({
                success: true,
                message: 'Employee reactivated successfully',
            })
        } catch (error: any) {
            logger.error('Reactivate employee error:', error)
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to reactivate employee',
            })
        }
    }

    /**
     * Get employee statistics (admin only)
     */
    async getEmployeeStats(req: Request, res: Response): Promise<void> {
        try {
            const stats = await employeeService.getEmployeeStats()

            res.status(200).json({
                success: true,
                message: 'Employee statistics retrieved successfully',
                data: { stats },
            })
        } catch (error: any) {
            logger.error('Get employee stats error:', error)
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to get employee statistics',
            })
        }
    }
}

// Export singleton instance
export const employeeController = new EmployeeController()
export default employeeController
