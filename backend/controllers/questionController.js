import Question from '../models/Question.js'
import SolvedQuestion from '../models/SolvedQuestion.js'

// @desc    Create a new question
// @route   POST /api/questions
// @access  Private
const createQuestion = async (req, res) => {
    const { questionNumber, title, statement, type, options, answer, hint, explanation, section, difficulty } = req.body

    try {
        const question = new Question ({
            questionNumber,
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
        const solvedQuestions = await SolvedQuestion.find({ userId }).select('questionNumber status')

        // Map solved questions to a dictionary for quick lookup
        const solvedQuestionsMap = solvedQuestions.reduce((acc, sq) => {
            acc[sq.questionNumber] = sq.status
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

// @desc    Get a question by questionNumber
// @route   GET /api/questions/:questionNumber
// @access  Public
const getQuestionByquestionNumber = async (req, res) => {
    try {
        const question = await Question.findOne({ questionNumber: req.params.questionNumber })

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
// @route   PUT /api/questions/:questionNumber
// @access  Private
const updateQuestion = async (req, res) => {
    const { title, statement, type, options, answer, hint, explanation, section, difficulty, status } = req.body

    try {
        const question = await Question.findOne({ questionNumber: req.params.questionNumber })

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
            question.questionNumber = question.questionNumber

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
// @route   DELETE /api/questions/:questionNumber
// @access  Private
const deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findOne({ questionNumber: req.params.questionNumber })

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
// @route  POST /api/questions/:questionNumber/solved
// @access Private
const recordSolvedQuestion = async (req, res) => {
    const { userId, section, type, difficulty, attempts, timeSpent, accuracy } = req.body
    const questionNumber = Number(req.params.questionNumber)

    try {
        // Calculate score
        const score = accuracy / timeSpent

        // Calculate percentile for this question
        const percentile = await calculatePercentile(questionNumber, score)

        // Create or update the solved question record
        const solvedQuestion = new SolvedQuestion({
            userId,
            questionNumber,
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
        const question = await Question.findOne({ questionNumber })
        if (!question) {
            return res.status(404).json({ error: 'Question not found' })
        }

        const solvedQuestions = await SolvedQuestion.find({ questionNumber })

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

const calculatePercentile = async (questionNumber, score) => {
    try {
        const allScores = await SolvedQuestion.find({ questionNumber }).select('score')

        if (allScores.length === 0) {
            return 0 // Return 0 if there are no scores
        }

        const scoresBelow = allScores.filter(q => q.score < score).length

        const percentile = (scoresBelow / allScores.length) * 100

        return percentile
    } catch (error) {
        console.error('Error calculating percentile:', error)
        return 0 // Return 0 if there is an error
    }
}

export { createQuestion, getQuestions, getQuestionByquestionNumber, updateQuestion, deleteQuestion, recordSolvedQuestion }