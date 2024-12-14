import express from 'express'
import { protect, admin } from '../middleware/authMiddleware.js'
import {
    getQuestionLists,
    createQuestionList,
    getQuestionListById,
    updateQuestionList,
    deleteQuestionList,
    toggleLike
} from '../controllers/questionListController.js'

const router = express.Router()

// Public routes
router.get('/', getQuestionLists)
router.get('/:id', getQuestionListById)

// Protected routes
router.post('/', protect, createQuestionList)
router.put('/:id', protect, updateQuestionList)
router.delete('/:id', protect, deleteQuestionList)
router.post('/:id/like', protect, toggleLike)

export default router 