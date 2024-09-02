import express from 'express'
import { registerUser, authUser, getUserProfile } from '../controllers/userController.js'
import { protect } from '../middleware/authMiddleware.js'

// Create a new router instance
const router = express.Router()

// @desc    Register a new user
// @route   POST /api/signup
// @access  Public
router.post('/signup', registerUser);

// @desc    Authenticate user & get token
// @route   POST /api/login
// @access  Public
router.post('/login', authUser);

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
router.route('/profile').get(protect, getUserProfile) ;

export default router