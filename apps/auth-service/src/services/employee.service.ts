import User, { IUser, UserRole, UserStatus, EmployeeType } from '../models/User'
import authService from './auth.service'
import { logger } from '@swachhbuddy/utils'

export interface EmployeeRegistrationData {
    email: string
    password: string
    firstName: string
    lastName: string
    phoneNumber?: string
    employeeType: EmployeeType
    employeeId: string
    department: string
    supervisor?: string
    assignedArea?: {
        name: string
        boundaries?: Array<{
            latitude: number
            longitude: number
        }>
    }
}

export interface EmployeeLoginData {
    email: string
    password: string
}

export interface EmployeeUpdateData {
    firstName?: string
    lastName?: string
    phoneNumber?: string
    department?: string
    supervisor?: string
    assignedArea?: {
        name: string
        boundaries?: Array<{
            latitude: number
            longitude: number
        }>
    }
}

class EmployeeService {
    /**
     * Register a new municipal employee
     */
    async registerEmployee(
        registrationData: EmployeeRegistrationData
    ): Promise<{ user: Partial<IUser>; tokens: any }> {
        try {
            const {
                email,
                password,
                firstName,
                lastName,
                phoneNumber,
                employeeType,
                employeeId,
                department,
                supervisor,
                assignedArea,
            } = registrationData

            // Check if user already exists
            const existingUser = await User.findOne({ email }).select('+password')
            if (existingUser) {
                throw new Error('Email is already registered')
            }

            // Check if employee ID is already taken
            const existingEmployee = await User.findOne({ employeeId })
            if (existingEmployee) {
                throw new Error('Employee ID is already taken')
            }

            // Validate password
            const passwordValidation = authService.validatePassword(password)
            if (!passwordValidation.isValid) {
                throw new Error(
                    `Password validation failed: ${passwordValidation.errors.join(', ')}`
                )
            }

            // Validate supervisor if provided
            let supervisorDoc = null
            if (supervisor) {
                supervisorDoc = await User.findOne({
                    _id: supervisor,
                    role: UserRole.EMPLOYEE,
                    employeeType: { $in: [EmployeeType.SUPERVISOR, EmployeeType.ADMIN] },
                })
                if (!supervisorDoc) {
                    throw new Error('Invalid supervisor ID')
                }
            }

            // Create new employee
            const newUser = new User({
                email,
                password,
                firstName,
                lastName,
                phoneNumber,
                role: UserRole.EMPLOYEE,
                status: UserStatus.ACTIVE,
                employeeType,
                employeeId,
                department,
                supervisor: supervisorDoc?._id,
                assignedArea,
            })

            const savedUser = await newUser.save()
            logger.info(`New employee registered: ${email} (${employeeId})`)

            // Generate tokens
            const tokens = authService.generateTokens(savedUser)

            // Store refresh token
            await authService.storeRefreshToken(savedUser._id.toString(), tokens.refreshToken)

            // Update last login
            await authService.updateLastLogin(savedUser._id.toString())

            return {
                user: authService.sanitizeUser(savedUser),
                tokens,
            }
        } catch (error: any) {
            logger.error('Employee registration failed:', error)
            throw new Error(error.message || 'Registration failed')
        }
    }

    /**
     * Login an employee
     */
    async loginEmployee(
        loginData: EmployeeLoginData
    ): Promise<{ user: Partial<IUser>; tokens: any }> {
        try {
            const { email, password } = loginData

            // Find user and include password field
            const user = await User.findOne({
                email: email.toLowerCase(),
                role: UserRole.EMPLOYEE,
            }).select('+password')

            if (!user) {
                throw new Error('Invalid credentials')
            }

            // Check if user is active
            if (!authService.isUserActive(user)) {
                throw new Error('Account is inactive or suspended')
            }

            // Compare password
            const isPasswordValid = await user.comparePassword(password)
            if (!isPasswordValid) {
                throw new Error('Invalid credentials')
            }

            // Generate tokens
            const tokens = authService.generateTokens(user)

            // Store refresh token
            await authService.storeRefreshToken(user._id.toString(), tokens.refreshToken)

            // Update last login
            await authService.updateLastLogin(user._id.toString())

            logger.info(`Employee logged in: ${email} (${user.employeeId})`)

            return {
                user: authService.sanitizeUser(user),
                tokens,
            }
        } catch (error: any) {
            logger.error('Employee login failed:', error)
            throw new Error(error.message || 'Login failed')
        }
    }

    /**
     * Get employee profile by ID
     */
    async getEmployeeProfile(employeeId: string): Promise<Partial<IUser>> {
        try {
            const user = await User.findOne({
                _id: employeeId,
                role: UserRole.EMPLOYEE,
                status: UserStatus.ACTIVE,
            }).populate('supervisor', 'firstName lastName employeeId employeeType')

            if (!user) {
                throw new Error('Employee not found')
            }

            return authService.sanitizeUser(user)
        } catch (error: any) {
            logger.error('Failed to get employee profile:', error)
            throw new Error(error.message || 'Failed to get employee profile')
        }
    }

    /**
     * Update employee profile
     */
    async updateEmployeeProfile(
        employeeId: string,
        updateData: EmployeeUpdateData
    ): Promise<Partial<IUser>> {
        try {
            // Validate supervisor if provided
            if (updateData.supervisor) {
                const supervisorDoc = await User.findOne({
                    _id: updateData.supervisor,
                    role: UserRole.EMPLOYEE,
                    employeeType: { $in: [EmployeeType.SUPERVISOR, EmployeeType.ADMIN] },
                })
                if (!supervisorDoc) {
                    throw new Error('Invalid supervisor ID')
                }
            }

            const user = await User.findOneAndUpdate(
                {
                    _id: employeeId,
                    role: UserRole.EMPLOYEE,
                    status: UserStatus.ACTIVE,
                },
                { $set: updateData },
                { new: true, runValidators: true }
            ).populate('supervisor', 'firstName lastName employeeId employeeType')

            if (!user) {
                throw new Error('Employee not found')
            }

            logger.info(`Employee profile updated: ${user.email} (${user.employeeId})`)

            return authService.sanitizeUser(user)
        } catch (error: any) {
            logger.error('Failed to update employee profile:', error)
            throw new Error(error.message || 'Failed to update profile')
        }
    }

    /**
     * Get employees by department
     */
    async getEmployeesByDepartment(
        department: string,
        employeeType?: EmployeeType
    ): Promise<Partial<IUser>[]> {
        try {
            const query: any = {
                role: UserRole.EMPLOYEE,
                status: UserStatus.ACTIVE,
                department: new RegExp(department, 'i'),
            }

            if (employeeType) {
                query.employeeType = employeeType
            }

            const employees = await User.find(query)
                .select('-password -refreshToken')
                .populate('supervisor', 'firstName lastName employeeId employeeType')
                .limit(100)

            return employees.map((employee) => authService.sanitizeUser(employee))
        } catch (error: any) {
            logger.error('Failed to get employees by department:', error)
            throw new Error(error.message || 'Failed to get employees')
        }
    }

    /**
     * Get employees by assigned area
     */
    async getEmployeesByArea(areaName: string): Promise<Partial<IUser>[]> {
        try {
            const employees = await User.find({
                role: UserRole.EMPLOYEE,
                status: UserStatus.ACTIVE,
                'assignedArea.name': new RegExp(areaName, 'i'),
            })
                .select('-password -refreshToken')
                .populate('supervisor', 'firstName lastName employeeId employeeType')
                .limit(50)

            return employees.map((employee) => authService.sanitizeUser(employee))
        } catch (error: any) {
            logger.error('Failed to get employees by area:', error)
            throw new Error(error.message || 'Failed to get employees')
        }
    }

    /**
     * Get subordinates of a supervisor
     */
    async getSubordinates(supervisorId: string): Promise<Partial<IUser>[]> {
        try {
            const subordinates = await User.find({
                role: UserRole.EMPLOYEE,
                status: UserStatus.ACTIVE,
                supervisor: supervisorId,
            })
                .select('-password -refreshToken')
                .limit(100)

            return subordinates.map((employee) => authService.sanitizeUser(employee))
        } catch (error: any) {
            logger.error('Failed to get subordinates:', error)
            throw new Error(error.message || 'Failed to get subordinates')
        }
    }

    /**
     * Change employee password
     */
    async changeEmployeePassword(
        employeeId: string,
        currentPassword: string,
        newPassword: string
    ): Promise<void> {
        try {
            // Find user with password
            const user = await User.findOne({
                _id: employeeId,
                role: UserRole.EMPLOYEE,
                status: UserStatus.ACTIVE,
            }).select('+password')

            if (!user) {
                throw new Error('Employee not found')
            }

            // Verify current password
            const isCurrentPasswordValid = await user.comparePassword(currentPassword)
            if (!isCurrentPasswordValid) {
                throw new Error('Current password is incorrect')
            }

            // Validate new password
            const passwordValidation = authService.validatePassword(newPassword)
            if (!passwordValidation.isValid) {
                throw new Error(
                    `Password validation failed: ${passwordValidation.errors.join(', ')}`
                )
            }

            // Update password
            user.password = newPassword
            await user.save()

            // Invalidate all refresh tokens for security
            await authService.removeRefreshToken(employeeId)

            logger.info(`Employee password changed: ${user.email} (${user.employeeId})`)
        } catch (error: any) {
            logger.error('Failed to change employee password:', error)
            throw new Error(error.message || 'Failed to change password')
        }
    }

    /**
     * Suspend employee account (admin only)
     */
    async suspendEmployee(employeeId: string): Promise<void> {
        try {
            const user = await User.findOneAndUpdate(
                {
                    _id: employeeId,
                    role: UserRole.EMPLOYEE,
                },
                {
                    status: UserStatus.SUSPENDED,
                    $unset: { refreshToken: 1 },
                }
            )

            if (!user) {
                throw new Error('Employee not found')
            }

            logger.info(`Employee account suspended: ${user.email} (${user.employeeId})`)
        } catch (error: any) {
            logger.error('Failed to suspend employee:', error)
            throw new Error(error.message || 'Failed to suspend account')
        }
    }

    /**
     * Reactivate employee account (admin only)
     */
    async reactivateEmployee(employeeId: string): Promise<void> {
        try {
            const user = await User.findOneAndUpdate(
                {
                    _id: employeeId,
                    role: UserRole.EMPLOYEE,
                },
                { status: UserStatus.ACTIVE }
            )

            if (!user) {
                throw new Error('Employee not found')
            }

            logger.info(`Employee account reactivated: ${user.email} (${user.employeeId})`)
        } catch (error: any) {
            logger.error('Failed to reactivate employee:', error)
            throw new Error(error.message || 'Failed to reactivate account')
        }
    }

    /**
     * Get employee statistics (admin only)
     */
    async getEmployeeStats(): Promise<any> {
        try {
            const stats = await User.aggregate([
                { $match: { role: UserRole.EMPLOYEE } },
                {
                    $group: {
                        _id: null,
                        totalEmployees: { $sum: 1 },
                        activeEmployees: {
                            $sum: { $cond: [{ $eq: ['$status', UserStatus.ACTIVE] }, 1, 0] },
                        },
                        suspendedEmployees: {
                            $sum: { $cond: [{ $eq: ['$status', UserStatus.SUSPENDED] }, 1, 0] },
                        },
                        employeesByType: {
                            $push: {
                                type: '$employeeType',
                                status: '$status',
                            },
                        },
                    },
                },
            ])

            // Group by employee type
            const typeStats = await User.aggregate([
                { $match: { role: UserRole.EMPLOYEE } },
                {
                    $group: {
                        _id: '$employeeType',
                        count: { $sum: 1 },
                        active: {
                            $sum: { $cond: [{ $eq: ['$status', UserStatus.ACTIVE] }, 1, 0] },
                        },
                    },
                },
            ])

            return {
                overview: stats[0] || {
                    totalEmployees: 0,
                    activeEmployees: 0,
                    suspendedEmployees: 0,
                },
                byType: typeStats,
            }
        } catch (error: any) {
            logger.error('Failed to get employee statistics:', error)
            throw new Error(error.message || 'Failed to get employee statistics')
        }
    }
}

// Export singleton instance
export const employeeService = new EmployeeService()
export default employeeService
