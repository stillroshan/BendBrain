import Question from '../models/Question.js'
import SolvedQuestion from '../models/SolvedQuestion.js'

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
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    const { section, difficulty, type, status, search, userId } = req.query
    let query = {}

    if (section) {
        query.section = section
    }

    if (difficulty) {
        query.difficulty = difficulty
    }

    if (type) {
        query.type = type
    }

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } }
        ]
    }

    try {
        const totalQuestions = await Question.countDocuments(query)
        const questions = await Question.find(query).limit(limit).skip(skip)

        // Fetch solved questions for the user
        const solvedQuestions = await SolvedQuestion.find({ userId }).select('questionId status')

        // Map solved questions to a dictionary for quick lookup
        const solvedQuestionsMap = solvedQuestions.reduce((acc, sq) => {
            acc[sq.questionId] = sq.status
            return acc
        }, {})

        // Add status to each question
        const questionsWithStatus = questions.map(question => ({
            ...question.toObject(),
            status: solvedQuestionsMap[question._id] || 'Unsolved'
        }))

        // Filter questions by status if the status filter is applied
        const filteredQuestions = status
            ? questionsWithStatus.filter(question => question.status === status)
            : questionsWithStatus

        res.json({
            questions: filteredQuestions,
            totalPages: Math.ceil(totalQuestions / limit),
            currentPage: page
        })
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
            question.questionId = question.questionId

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

// @desc   Record a solved question
// @route  POST /api/questions/solved
// @access Private
const recordSolvedQuestion = async (req, res) => {
    const { userId, questionId, section, type, difficulty, attempts, timeSpent } = req.body

    try {
        // Calculate accuracy and score
        const accuracy = (1 / attempts) * 100
        const score = accuracy / timeSpent

        // Calculate percentile for this question
        const percentile = await calculatePercentile(questionId, score)

        // Create or update the solved question record
        const solvedQuestion = new SolvedQuestion({
            userId,
            questionId,
            section,
            type,
            difficulty,
            attempts,
            accuracy,
            timeSpent,
            score,
            percentile
        })

        await solvedQuestion.save()

        // Update the question's average accuracy and time spent
        const question = await Question.findById(questionId)
        const solvedQuestions = await SolvedQuestion.find({ questionId })

        const totalAccuracy = solvedQuestions.reduce((acc, q) => acc + q.accuracy, 0)
        const totalTimeSpent = solvedQuestions.reduce((acc, q) => acc + q.timeSpent, 0)
        const totalAttempts = solvedQuestions.length

        question.avgAccuracy = totalAccuracy / totalAttempts
        question.avgTimeSpent = totalTimeSpent / totalAttempts

        await question.save()

        res.status(201).json({ message: 'Solved question recorded' })
    } catch (error) {
        res.status(400).json({ error: 'Error reading solved question'})
    }
}

const calculatePercentile = async (questionId, score) => {
    const allScores = await SolvedQuestion.find({ questionId }).select('scoer')
    const scoresBelow = allScores.filter(q => q.score < userScore).length

    const percentile = (scoresBelow / allScores.length) * 100

    return percentile
}

export { createQuestion, getQuestions, getQuestionByQuestionId, updateQuestion, deleteQuestion, recordSolvedQuestion }