import User, { IUser, UserRole, UserStatus } from '../models/User'
import authService from './auth.service'
import { logger } from '@swachhbuddy/utils'

export interface CitizenRegistrationData {
    email: string
    password: string
    firstName: string
    lastName: string
    phoneNumber?: string
    address?: {
        street: string
        city: string
        state: string
        pincode: string
        coordinates?: {
            latitude: number
            longitude: number
        }
    }
}

export interface CitizenLoginData {
    email: string
    password: string
}

export interface CitizenUpdateData {
    firstName?: string
    lastName?: string
    phoneNumber?: string
    address?: {
        street: string
        city: string
        state: string
        pincode: string
        coordinates?: {
            latitude: number
            longitude: number
        }
    }
}

class CitizenService {
    /**
     * Register a new citizen
     */
    async registerCitizen(
        registrationData: CitizenRegistrationData
    ): Promise<{ user: Partial<IUser>; tokens: any }> {
        try {
            const { email, password, firstName, lastName, phoneNumber, address } = registrationData

            // Check if user already exists
            const existingUser = await User.findOne({ email }).select('+password')
            if (existingUser) {
                throw new Error('Email is already registered')
            }

            // Validate password
            const passwordValidation = authService.validatePassword(password)
            if (!passwordValidation.isValid) {
                throw new Error(
                    `Password validation failed: ${passwordValidation.errors.join(', ')}`
                )
            }

            // Create new citizen
            const newUser = new User({
                email,
                password,
                firstName,
                lastName,
                phoneNumber,
                role: UserRole.CITIZEN,
                status: UserStatus.ACTIVE,
                address,
            })

            const savedUser = await newUser.save()
            logger.info(`New citizen registered: ${email}`)

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
            logger.error('Citizen registration failed:', error)
            throw new Error(error.message || 'Registration failed')
        }
    }

    /**
     * Login a citizen
     */
    async loginCitizen(
        loginData: CitizenLoginData
    ): Promise<{ user: Partial<IUser>; tokens: any }> {
        try {
            const { email, password } = loginData

            // Find user and include password field
            const user = await User.findOne({
                email: email.toLowerCase(),
                role: UserRole.CITIZEN,
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

            logger.info(`Citizen logged in: ${email}`)

            return {
                user: authService.sanitizeUser(user),
                tokens,
            }
        } catch (error: any) {
            logger.error('Citizen login failed:', error)
            throw new Error(error.message || 'Login failed')
        }
    }

    /**
     * Get citizen profile by ID
     */
    async getCitizenProfile(citizenId: string): Promise<Partial<IUser>> {
        try {
            const user = await User.findOne({
                _id: citizenId,
                role: UserRole.CITIZEN,
                status: UserStatus.ACTIVE,
            })

            if (!user) {
                throw new Error('Citizen not found')
            }

            return authService.sanitizeUser(user)
        } catch (error: any) {
            logger.error('Failed to get citizen profile:', error)
            throw new Error(error.message || 'Failed to get citizen profile')
        }
    }

    /**
     * Update citizen profile
     */
    async updateCitizenProfile(
        citizenId: string,
        updateData: CitizenUpdateData
    ): Promise<Partial<IUser>> {
        try {
            const user = await User.findOneAndUpdate(
                {
                    _id: citizenId,
                    role: UserRole.CITIZEN,
                    status: UserStatus.ACTIVE,
                },
                { $set: updateData },
                { new: true, runValidators: true }
            )

            if (!user) {
                throw new Error('Citizen not found')
            }

            logger.info(`Citizen profile updated: ${user.email}`)

            return authService.sanitizeUser(user)
        } catch (error: any) {
            logger.error('Failed to update citizen profile:', error)
            throw new Error(error.message || 'Failed to update profile')
        }
    }

    /**
     * Change citizen password
     */
    async changeCitizenPassword(
        citizenId: string,
        currentPassword: string,
        newPassword: string
    ): Promise<void> {
        try {
            // Find user with password
            const user = await User.findOne({
                _id: citizenId,
                role: UserRole.CITIZEN,
                status: UserStatus.ACTIVE,
            }).select('+password')

            if (!user) {
                throw new Error('Citizen not found')
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
            await authService.removeRefreshToken(citizenId)

            logger.info(`Citizen password changed: ${user.email}`)
        } catch (error: any) {
            logger.error('Failed to change citizen password:', error)
            throw new Error(error.message || 'Failed to change password')
        }
    }

    /**
     * Get citizens by location (for admin/employee use)
     */
    async getCitizensByLocation(city: string, state?: string): Promise<Partial<IUser>[]> {
        try {
            const query: any = {
                role: UserRole.CITIZEN,
                status: UserStatus.ACTIVE,
                'address.city': new RegExp(city, 'i'),
            }

            if (state) {
                query['address.state'] = new RegExp(state, 'i')
            }

            const citizens = await User.find(query).select('-password -refreshToken').limit(100) // Limit results for performance

            return citizens.map((citizen) => authService.sanitizeUser(citizen))
        } catch (error: any) {
            logger.error('Failed to get citizens by location:', error)
            throw new Error(error.message || 'Failed to get citizens')
        }
    }

    /**
     * Deactivate citizen account
     */
    async deactivateCitizen(citizenId: string): Promise<void> {
        try {
            const user = await User.findOneAndUpdate(
                {
                    _id: citizenId,
                    role: UserRole.CITIZEN,
                },
                {
                    status: UserStatus.INACTIVE,
                    $unset: { refreshToken: 1 },
                }
            )

            if (!user) {
                throw new Error('Citizen not found')
            }

            logger.info(`Citizen account deactivated: ${user.email}`)
        } catch (error: any) {
            logger.error('Failed to deactivate citizen:', error)
            throw new Error(error.message || 'Failed to deactivate account')
        }
    }
}

// Export singleton instance
export const citizenService = new CitizenService()
export default citizenService
