import express from 'express'
import { protect, admin } from '../middleware/authMiddleware.js'
import {
    getQuestionLists,
    getUserLists,
    getQuestionListById,
    createQuestionList,
    updateQuestionList,
    deleteQuestionList,
    toggleSaveList,
    toggleLikeList
} from '../controllers/questionListController.js'

const router = express.Router()

// Public routes
router.get('/', getQuestionLists)
router.get('/:id', getQuestionListById)

// Protected routes
router.use(protect)

// User-specific routes
router.get('/user/lists', getUserLists)

// List management routes
router.post('/', createQuestionList)
router.put('/:id', updateQuestionList)
router.delete('/:id', deleteQuestionList)

// List interaction routes
router.post('/:id/save', toggleSaveList)
router.post('/:id/like', toggleLikeList)

export default router 