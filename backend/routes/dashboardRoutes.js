import express from 'express'
import { getUserProgress } from '../controllers/dashboardController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/')
    .get(protect, getUserProgress)

export default router