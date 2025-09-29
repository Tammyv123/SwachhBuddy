// lib/auth.ts
export interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    role: 'citizen' | 'employee'
    phoneNumber?: string
    address?: {
        street: string
        city: string
        state: string
        pincode: string
    }
    employeeType?: string
    employeeId?: string
    department?: string
}

export interface AuthResponse {
    success: boolean
    user?: User
    accessToken?: string
    refreshToken?: string
    message?: string
}

export interface LoginData {
    email: string
    password: string
}

export interface RegisterData {
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
    }
    // For employees
    employeeType?: string
    employeeId?: string
    department?: string
}

class AuthService {
    private baseURL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:3001'

    private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
        const url = `${this.baseURL}${endpoint}`
        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        }

        return fetch(url, config)
    }

    async loginCitizen(data: LoginData): Promise<AuthResponse> {
        try {
            const response = await this.makeRequest('/citizens/login', {
                method: 'POST',
                body: JSON.stringify(data),
            })

            const result = await response.json()

            if (response.ok) {
                // Store tokens in localStorage
                if (result.accessToken) {
                    localStorage.setItem('accessToken', result.accessToken)
                }
                if (result.refreshToken) {
                    localStorage.setItem('refreshToken', result.refreshToken)
                }

                return {
                    success: true,
                    user: result.user,
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken,
                }
            } else {
                return {
                    success: false,
                    message: result.message || 'Login failed',
                }
            }
        } catch (error) {
            return {
                success: false,
                message: 'Network error occurred',
            }
        }
    }

    async loginEmployee(data: LoginData): Promise<AuthResponse> {
        try {
            const response = await this.makeRequest('/employees/login', {
                method: 'POST',
                body: JSON.stringify(data),
            })

            const result = await response.json()

            if (response.ok) {
                // Store tokens in localStorage
                if (result.accessToken) {
                    localStorage.setItem('accessToken', result.accessToken)
                }
                if (result.refreshToken) {
                    localStorage.setItem('refreshToken', result.refreshToken)
                }

                return {
                    success: true,
                    user: result.user,
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken,
                }
            } else {
                return {
                    success: false,
                    message: result.message || 'Login failed',
                }
            }
        } catch (error) {
            return {
                success: false,
                message: 'Network error occurred',
            }
        }
    }

    async registerCitizen(data: RegisterData): Promise<AuthResponse> {
        try {
            const response = await this.makeRequest('/citizens/register', {
                method: 'POST',
                body: JSON.stringify(data),
            })

            const result = await response.json()

            if (response.ok) {
                return {
                    success: true,
                    user: result.user,
                    message: 'Registration successful',
                }
            } else {
                return {
                    success: false,
                    message: result.message || 'Registration failed',
                }
            }
        } catch (error) {
            return {
                success: false,
                message: 'Network error occurred',
            }
        }
    }

    async registerEmployee(data: RegisterData): Promise<AuthResponse> {
        try {
            const response = await this.makeRequest('/employees/register', {
                method: 'POST',
                body: JSON.stringify(data),
            })

            const result = await response.json()

            if (response.ok) {
                return {
                    success: true,
                    user: result.user,
                    message: 'Registration successful',
                }
            } else {
                return {
                    success: false,
                    message: result.message || 'Registration failed',
                }
            }
        } catch (error) {
            return {
                success: false,
                message: 'Network error occurred',
            }
        }
    }

    async logout(): Promise<void> {
        try {
            // Call logout endpoint
            await this.makeRequest('/citizens/logout', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.getAccessToken()}`,
                },
            })
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            // Clear tokens from localStorage
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
        }
    }

    getAccessToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('accessToken')
        }
        return null
    }

    getRefreshToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('refreshToken')
        }
        return null
    }

    isAuthenticated(): boolean {
        return !!this.getAccessToken()
    }

    async getCurrentUser(): Promise<User | null> {
        const token = this.getAccessToken()
        if (!token) return null

        try {
            // Try citizen profile first
            let response = await this.makeRequest('/citizens/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.ok) {
                const result = await response.json()
                return result.user
            }

            // Try employee profile
            response = await this.makeRequest('/employees/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.ok) {
                const result = await response.json()
                return result.user
            }

            return null
        } catch (error) {
            console.error('Get current user error:', error)
            return null
        }
    }
}

export const authService = new AuthService()
