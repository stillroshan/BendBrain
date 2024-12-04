import express from 'express'
import { protect, admin } from '../middleware/authMiddleware.js'
import {
    getDiscussions,
    getQuestionDiscussions,
    createDiscussion,
    addReply,
    toggleLike,
    toggleDislike,
    togglePin,
    incrementViews,
    getDiscussionById
} from '../controllers/discussionController.js'

const router = express.Router()

// Public routes
router.get('/', getDiscussions)
router.get('/question/:questionId', getQuestionDiscussions)
router.post('/view/:discussionId', incrementViews)
router.get('/:id', getDiscussionById)

// Protected routes
router.post('/', protect, createDiscussion)
router.post('/:discussionId/reply', protect, addReply)
router.post('/:discussionId/like', protect, toggleLike)
router.post('/:discussionId/dislike', protect, toggleDislike)

// Admin routes
router.post('/:discussionId/pin', protect, admin, togglePin)

export default router 