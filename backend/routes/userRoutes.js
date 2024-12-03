import express from 'express'
import { registerUser, authUser, getUserProfile, forgotPassword, resetPassword, updateUserProfile, uploadProfilePicture } from '../controllers/userController.js'
import { protect } from '../middleware/authMiddleware.js'

// Create a new router instance
const router = express.Router()

// @desc    Register a new user
// @route   POST /api/signup
// @access  Public
router.post('/signup', registerUser)

// @desc    Authenticate user & get token
// @route   POST /api/login
// @access  Public
router.post('/login', authUser)

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
router.route('/profile').get(protect, getUserProfile)

// @desc    Forgot password
// @route   POST /api/forgotpassword
// @access  Public
router.post('/forgotpassword', forgotPassword)

// @desc    Reset password
// @route   PUT /api/resetpassword/:token
// @access  Public
router.put('/resetpassword/:token', resetPassword)

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
router.route('/profile').put(protect, updateUserProfile)

// @desc    Upload profile picture
// @route   POST /api/profile/upload
// @access  Private
router.post('/profile/upload', protect, uploadProfilePicture)

export default router