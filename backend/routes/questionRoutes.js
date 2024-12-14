import express from 'express'
import { createQuestion, getQuestions, getQuestionByquestionNumber, updateQuestion, deleteQuestion, recordSolvedQuestion, getRandomQuestion, getSolvedStatus } from '../controllers/questionController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/')
    .post(protect, admin, createQuestion)
    .get(getQuestions)

router.get('/random', getRandomQuestion)

router.route('/:questionNumber')
    .get(getQuestionByquestionNumber)
    .put(protect, admin, updateQuestion)
    .delete(protect, admin, deleteQuestion)

router.route('/:questionNumber/solved')
    .get(protect, getSolvedStatus)
    .post(protect, recordSolvedQuestion)

export default router