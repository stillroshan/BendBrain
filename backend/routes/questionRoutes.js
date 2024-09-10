import express from 'express'
import { createQuestion, getQuestions, getQuestionByQuestionId, updateQuestion, deleteQuestion } from '../controllers/questionController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/')
    .post(protect, admin, createQuestion)
    .get(getQuestions)

router.route('/:questionId')
    .get(getQuestionByQuestionId)
    .put(protect, admin, updateQuestion)
    .delete(protect, admin, deleteQuestion)

export default router