import express from 'express'
import { getUserProgress, getActivityData } from '../controllers/dashboardController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/')
    .get(protect, getUserProgress)

router.route('/activity')
    .get(protect, getActivityData)

export default router