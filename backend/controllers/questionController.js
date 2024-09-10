import Question from '../models/Question.js'

// @desc    Create a new question
// @route   POST /api/questions
// @access  Private
const createQuestion = async (req, res) => {
    const { questionId, title, statement, type, options, answer, hint, explanation, section, difficulty } = req.body

    try {
        const question = new Question ({
            questionId,
            title,
            statement,
            type,
            options,
            answer,
            hint,
            explanation,
            section,
            difficulty
        })

        const createdQuestion = await question.save()
        res.status(201).json(createdQuestion)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// @desc    Get all questions
// @route   GET /api/questions
// @access  Public
const getQuestions = async (req, res) => {
    try {
        const questions = await Question.find({})
        res.json(questions)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Get a question by questionId
// @route   GET /api/questions/:questionId
// @access  Public
const getQuestionByQuestionId = async (req, res) => {
    try {
        const question = await Question.findOne({ questionId: req.params.questionId })

        if (question) {
            res.json(question)
        } else {
            res.status(404).json({ message: 'Question not found' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Update a question
// @route   PUT /api/questions/:questionId
// @access  Private
const updateQuestion = async (req, res) => {
    const { title, statement, type, options, answer, hint, explanation, section, difficulty, status } = req.body

    try {
        const question = await Question.findOne({ questionId: req.params.questionId })

        if (question) {
            question.title = title || question.title
            question.statement = statement || question.statement
            question.type = type || question.type
            question.options = options || question.options
            question.answer = answer || question.answer
            question.hint = hint || question.hint
            question.explanation = explanation || question.explanation
            question.section = section || question.section
            question.difficulty = difficulty || question.difficulty
            question.status = status || question.status
            question.questionId = questionId || question.questionId

            const updatedQuestion = await question.save()
            res.json(updatedQuestion)
        } else {
            res.status(404).json({ message: 'Question not found' })
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// @desc    Delete a question
// @route   DELETE /api/questions/:questionId
// @access  Private
const deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findOne({ questionId: req.params.questionId })

        if (question) {
            await question.deleteOne()
            res.json({ message: 'Question removed' })
        } else {
            res.status(404).json({ message: 'Question not found' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export { createQuestion, getQuestions, getQuestionByQuestionId, updateQuestion, deleteQuestion }