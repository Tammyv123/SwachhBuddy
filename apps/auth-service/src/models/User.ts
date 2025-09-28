import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

// Define user roles
export enum UserRole {
    CITIZEN = 'citizen',
    EMPLOYEE = 'employee',
}

// Define user status
export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SUSPENDED = 'suspended',
}

// Define employee types for municipal workers
export enum EmployeeType {
    WASTE_COLLECTOR = 'waste_collector',
    SUPERVISOR = 'supervisor',
    ADMIN = 'admin',
    DRIVER = 'driver',
}

// Base user interface
export interface IUser extends Document {
    _id: mongoose.Types.ObjectId
    email: string
    password: string
    firstName: string
    lastName: string
    phoneNumber?: string
    role: UserRole
    status: UserStatus
    isEmailVerified: boolean
    refreshToken?: string
    lastLogin?: Date
    createdAt: Date
    updatedAt: Date

    // Role-specific fields
    // Citizen fields
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

    // Employee fields
    employeeType?: EmployeeType
    employeeId?: string
    department?: string
    supervisor?: mongoose.Types.ObjectId
    assignedArea?: {
        name: string
        boundaries?: any[]
    }

    // Methods
    comparePassword(candidatePassword: string): Promise<boolean>
    generateRefreshToken(): string
    toJSON(): any
}

// User Schema
const UserSchema: Schema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false, // Don't include password in queries by default
        },
        firstName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
        },
        phoneNumber: {
            type: String,
            trim: true,
            match: [/^\+?[\d\s\-\(\)]{10,}$/, 'Please enter a valid phone number'],
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            required: true,
            default: UserRole.CITIZEN,
        },
        status: {
            type: String,
            enum: Object.values(UserStatus),
            default: UserStatus.ACTIVE,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        refreshToken: {
            type: String,
            select: false,
        },
        lastLogin: {
            type: Date,
        },

        // Citizen-specific fields
        address: {
            street: {
                type: String,
                trim: true,
            },
            city: {
                type: String,
                trim: true,
            },
            state: {
                type: String,
                trim: true,
            },
            pincode: {
                type: String,
                trim: true,
                match: [/^\d{6}$/, 'Please enter a valid 6-digit pincode'],
            },
            coordinates: {
                latitude: {
                    type: Number,
                    min: -90,
                    max: 90,
                },
                longitude: {
                    type: Number,
                    min: -180,
                    max: 180,
                },
            },
        },

        // Employee-specific fields
        employeeType: {
            type: String,
            enum: Object.values(EmployeeType),
            required: function (this: IUser) {
                return this.role === UserRole.EMPLOYEE
            },
        },
        employeeId: {
            type: String,
            unique: true,
            sparse: true, // Allow null values but enforce uniqueness when present
            required: function (this: IUser) {
                return this.role === UserRole.EMPLOYEE
            },
        },
        department: {
            type: String,
            required: function (this: IUser) {
                return this.role === UserRole.EMPLOYEE
            },
        },
        supervisor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        assignedArea: {
            name: {
                type: String,
                trim: true,
            },
            boundaries: [
                {
                    latitude: Number,
                    longitude: Number,
                },
            ],
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: function (doc: any, ret: any) {
                delete ret.password
                delete ret.refreshToken
                return ret
            },
        },
    }
)

// Indexes for performance
UserSchema.index({ role: 1 })
UserSchema.index({ status: 1 })

// Pre-save middleware to hash password
UserSchema.pre<IUser>('save', async function (next) {
    // Only hash the password if it has been modified or is new
    if (!this.isModified('password')) return next()

    try {
        const rounds = parseInt(process.env.BCRYPT_ROUNDS || '12')
        const hashedPassword = await bcrypt.hash(this.password, rounds)
        this.password = hashedPassword
        next()
    } catch (error) {
        next(error as Error)
    }
})

// Instance method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(candidatePassword, this.password)
    } catch (error) {
        return false
    }
}

// Instance method to generate refresh token
UserSchema.methods.generateRefreshToken = function (): string {
    const crypto = require('crypto')
    return crypto.randomBytes(32).toString('hex')
}

// Virtual for full name
UserSchema.virtual('fullName').get(function (this: IUser) {
    return `${this.firstName} ${this.lastName}`
})

// Create and export the model
const User = mongoose.model<IUser>('User', UserSchema)

export default User
