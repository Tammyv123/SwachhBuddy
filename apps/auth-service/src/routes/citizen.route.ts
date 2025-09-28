import { Router } from 'express'
import citizenController from '../controllers/citizen.controller'
import {
    authenticateToken,
    requireCitizen,
    validateRequiredFields,
    sanitizeBody,
} from '../middlewares/auth.middleware'

const router = Router()

// Apply sanitization middleware to all routes
router.use(sanitizeBody())

/**
 * POST /citizens/register
 * Register a new citizen
 */
router.post(
    '/register',
    validateRequiredFields(['email', 'password', 'firstName', 'lastName']),
    citizenController.register.bind(citizenController)
)

/**
 * POST /citizens/login
 * Login a citizen
 */
router.post(
    '/login',
    validateRequiredFields(['email', 'password']),
    citizenController.login.bind(citizenController)
)

/**
 * POST /citizens/logout
 * Logout a citizen
 */
router.post('/logout', citizenController.logout.bind(citizenController))

/**
 * POST /citizens/refresh-token
 * Refresh access token
 */
router.post('/refresh-token', citizenController.refreshToken.bind(citizenController))

/**
 * GET /citizens/profile
 * Get current citizen profile
 */
router.get(
    '/profile',
    authenticateToken,
    requireCitizen,
    citizenController.getProfile.bind(citizenController)
)

/**
 * PUT /citizens/profile
 * Update citizen profile
 */
router.put(
    '/profile',
    authenticateToken,
    requireCitizen,
    citizenController.updateProfile.bind(citizenController)
)

/**
 * POST /citizens/change-password
 * Change citizen password
 */
router.post(
    '/change-password',
    authenticateToken,
    requireCitizen,
    validateRequiredFields(['currentPassword', 'newPassword']),
    citizenController.changePassword.bind(citizenController)
)

/**
 * DELETE /citizens/account
 * Deactivate citizen account
 */
router.delete(
    '/account',
    authenticateToken,
    requireCitizen,
    citizenController.deactivateAccount.bind(citizenController)
)

/**
 * GET /citizens/by-location
 * Get citizens by location (for admin/employee use)
 * Requires employee authentication
 */
router.get(
    '/by-location',
    authenticateToken,
    // Note: This should be restricted to employees only in production
    citizenController.getCitizensByLocation.bind(citizenController)
)

export default router
