import User from '../models/User.js'
import crypto from 'crypto'
import sendEmail from '../utils/sendEmail.js'
import cloudinary from '../config/cloudinaryConfig.js'

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
            token: user.generateAuthToken()
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
                token: user.generateAuthToken()
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

// @desc    Forgot password
// @route   POST /api/forgotpassword
// @access  Public
const forgotPassword = async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email })

    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }

    const resetToken = crypto.randomBytes(20).toString('hex')
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000 // 10 minutes
    await user.save()

    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`

    try {
        await sendEmail({
            to: user.email,
            subject: 'Password Reset Token',
            text: message
        })

        res.status(200).json({ message: 'Email sent' })
    } catch (error) {
        console.error('Error sending email:', error)
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save()
        res.status(500).json({ message: 'Email could not be sent' })
    }
}

// @desc    Reset password
// @route   PUT /api/resetpassword/:token
// @access  Public
const resetPassword = async (req, res) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return res.status(400).json({ message: 'Invalid token' })
    }

    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    res.status(200).json({ message: 'Password updated successfully'})
}

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        user.username = req.body.username || user.username
        user.email = req.body.email || user.email
        
        if (req.body.password) {
            user.password = req.body.password
        }

        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: updatedUser.generateAuthToken()
        })
    } else {
        res.status(404).json({ message: 'User not found' })
    }
}

// @desc    Upload profile picture
// @route   POST /api/profile/upload
// @access  Private
const uploadProfilePicture = async (req, res) => {
    try {
      if (!req.files || !req.files.file) {
        return res.status(400).json({ message: 'No file uploaded' })
      }

      const file = req.files.file
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: 'profile_pictures',
      })
  
      const user = await User.findById(req.user._id)
      user.profilePicture = result.secure_url
      await user.save()
  
      res.json({ profilePicture: user.profilePicture })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
}

export { registerUser, authUser, getUserProfile, forgotPassword, resetPassword, updateUserProfile, uploadProfilePicture }