import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    googleId: {
        type: String,
        default: null
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId // Password is required if user is not signing up with Google
        }
    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordExpire: {
        type: Date,
        default: null
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 800
    },
    profilePicture: {
        type: String,
        default: null,
    }
}, { 
    timestamps: true
})

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

// Method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// Method to generate JWT token
userSchema.methods.generateAuthToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { 
        expiresIn: '30d' 
    })
}

const User = mongoose.model('User', userSchema)

export default User