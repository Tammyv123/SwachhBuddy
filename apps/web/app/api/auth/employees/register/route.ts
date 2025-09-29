import { NextRequest, NextResponse } from 'next/server'

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:6001'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const response = await fetch(`${AUTH_SERVICE_URL}/auth/employees/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })

        const data = await response.json()

        if (response.ok) {
            // Create response with cookies
            const nextResponse = NextResponse.json(data)

            // Set cookies if tokens are provided
            if (data.data?.accessToken) {
                nextResponse.cookies.set('accessToken', data.data.accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 15 * 60, // 15 minutes
                    path: '/',
                })
            }

            if (data.data?.refreshToken) {
                nextResponse.cookies.set('refreshToken', data.data.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 7 * 24 * 60 * 60, // 7 days
                    path: '/',
                })
            }

            return nextResponse
        } else {
            return NextResponse.json(data, { status: response.status })
        }
    } catch (error) {
        console.error('Employee register API error:', error)
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        )
    }
}
