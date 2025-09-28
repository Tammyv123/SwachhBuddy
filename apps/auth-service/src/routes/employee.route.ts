import { Router } from 'express'
import employeeController from '../controllers/employee.controller'
import {
    authenticateToken,
    requireEmployee,
    validateRequiredFields,
    sanitizeBody,
} from '../middlewares/auth.middleware'

const router = Router()

// Apply sanitization middleware to all routes
router.use(sanitizeBody())

/**
 * POST /employees/register
 * Register a new employee (admin only in production)
 */
router.post(
    '/register',
    validateRequiredFields([
        'email',
        'password',
        'firstName',
        'lastName',
        'employeeType',
        'employeeId',
        'department',
    ]),
    employeeController.register.bind(employeeController)
)

/**
 * POST /employees/login
 * Login an employee
 */
router.post(
    '/login',
    validateRequiredFields(['email', 'password']),
    employeeController.login.bind(employeeController)
)

/**
 * POST /employees/logout
 * Logout an employee
 */
router.post('/logout', employeeController.logout.bind(employeeController))

/**
 * POST /employees/refresh-token
 * Refresh access token
 */
router.post('/refresh-token', employeeController.refreshToken.bind(employeeController))

/**
 * GET /employees/profile
 * Get current employee profile
 */
router.get(
    '/profile',
    authenticateToken,
    requireEmployee,
    employeeController.getProfile.bind(employeeController)
)

/**
 * PUT /employees/profile
 * Update employee profile
 */
router.put(
    '/profile',
    authenticateToken,
    requireEmployee,
    employeeController.updateProfile.bind(employeeController)
)

/**
 * POST /employees/change-password
 * Change employee password
 */
router.post(
    '/change-password',
    authenticateToken,
    requireEmployee,
    validateRequiredFields(['currentPassword', 'newPassword']),
    employeeController.changePassword.bind(employeeController)
)

/**
 * GET /employees/by-department
 * Get employees by department
 */
router.get(
    '/by-department',
    authenticateToken,
    requireEmployee,
    employeeController.getEmployeesByDepartment.bind(employeeController)
)

/**
 * GET /employees/by-area
 * Get employees by assigned area
 */
router.get(
    '/by-area',
    authenticateToken,
    requireEmployee,
    employeeController.getEmployeesByArea.bind(employeeController)
)

/**
 * GET /employees/subordinates
 * Get subordinates (for supervisors)
 */
router.get(
    '/subordinates',
    authenticateToken,
    requireEmployee,
    employeeController.getSubordinates.bind(employeeController)
)

/**
 * POST /employees/:employeeId/suspend
 * Suspend employee (admin only)
 */
router.post(
    '/:employeeId/suspend',
    authenticateToken,
    requireEmployee,
    // TODO: Add admin-only check
    employeeController.suspendEmployee.bind(employeeController)
)

/**
 * POST /employees/:employeeId/reactivate
 * Reactivate employee (admin only)
 */
router.post(
    '/:employeeId/reactivate',
    authenticateToken,
    requireEmployee,
    // TODO: Add admin-only check
    employeeController.reactivateEmployee.bind(employeeController)
)

/**
 * GET /employees/stats
 * Get employee statistics (admin only)
 */
router.get(
    '/stats',
    authenticateToken,
    requireEmployee,
    // TODO: Add admin-only check
    employeeController.getEmployeeStats.bind(employeeController)
)

export default router
