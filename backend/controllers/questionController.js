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
        const questions = await Question.find(query).sort({ questionNumber: 1 }).limit(limit).skip(skip)

        // Fetch solved questions for the user
        const solvedQuestions = await SolvedQuestion.find({ userId })

        // Map solved questions to a dictionary for quick lookup
        const solvedQuestionsMap = solvedQuestions.reduce((acc, sq) => {
            acc[sq.questionNumber] = sq.status
            return acc
        }, {})

        // Add status to each question
        const questionsWithStatus = questions.map(question => ({
            ...question.toObject(),
            status: solvedQuestionsMap[question.questionNumber] || 'Unsolved'
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
            percentile,
            status: accuracy > 0 ? 'Solved' : 'Attempted'
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

// @desc    Get a random question based on filters
// @route   GET /api/questions/random
// @access  Public
const getRandomQuestion = async (req, res) => {
    try {
        const { section, difficulty, type, status, userId } = req.query
        let query = {}

        // Add filters to query if they exist
        if (section) query.section = section
        if (difficulty) query.difficulty = difficulty
        if (type) query.type = type

        // If status filter is applied and userId is provided
        if (status && userId) {
            // Get all matching questions first
            const questions = await Question.find(query)
            const solvedQuestions = await SolvedQuestion.find({ userId })
            
            // Create a map of question statuses
            const solvedQuestionsMap = solvedQuestions.reduce((acc, sq) => {
                acc[sq.questionNumber] = sq.status
                return acc
            }, {})

            // Filter questions based on status
            const filteredQuestions = questions.filter(question => {
                const questionStatus = solvedQuestionsMap[question.questionNumber] || 'Unsolved'
                return status === questionStatus
            })

            if (filteredQuestions.length === 0) {
                return res.status(404).json({ message: 'No questions found matching the criteria' })
            }

            // Pick a random question from filtered list
            const randomIndex = Math.floor(Math.random() * filteredQuestions.length)
            return res.json(filteredQuestions[randomIndex])
        }

        // If no status filter or no userId, get count of matching questions
        const count = await Question.countDocuments(query)
        if (count === 0) {
            return res.status(404).json({ message: 'No questions found matching the criteria' })
        }

        // Get a random question using aggregation
        const randomQuestion = await Question.aggregate([
            { $match: query },
            { $sample: { size: 1 } }
        ])

        res.json(randomQuestion[0])
    } catch (error) {
        console.error('Error getting random question:', error)
        res.status(500).json({ message: error.message })
    }
}

const getSolvedStatus = async (req, res) => {
    try {
        const questionNumber = Number(req.params.questionNumber)
        const userId = req.user._id

        const solvedQuestion = await SolvedQuestion.findOne({
            questionNumber,
            userId
        })

        res.json({
            status: solvedQuestion ? solvedQuestion.status : 'Unsolved'
        })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export { createQuestion, getQuestions, getQuestionByquestionNumber, updateQuestion, deleteQuestion, recordSolvedQuestion, getRandomQuestion, getSolvedStatus }