import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// @desc    Register a new user
// @route   POST /api/signup
// @access  Public
const registerUser = async (req, res) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please fill in all fileds' })
    }

    const userExists = await User.findOne({ email })

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' })
    }

    const user = await User.create({
        username,
        email,
        password
    })

    if (user) {
        return res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        return res.status(400).json({ message: 'Invalid user data'})
    }
}

// @desc    Authenticate user & get token
// @route   POST /api/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (user) {
        const correctPassword = await user.comparePassword(password)

        if (correctPassword) {
            return res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id)
            })
        } else {
            return res.status(401).json({ message: 'Invalid email or passowrd' })
        }
    } else {
        return res.status(401).json({ message: 'User not found' })
    }
}

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        return res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin
        })
    } else {
        return res.status(404).json({ message: 'User not found' })
    }
}

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

export { registerUser, authUser, getUserProfile }