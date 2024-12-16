import express from 'express'
import { getUserProgress, getActivityData } from '../controllers/dashboardController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/progress', protect, getUserProgress)
router.get('/activity', protect, getActivityData)

export default router