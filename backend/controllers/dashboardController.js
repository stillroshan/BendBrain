import SolvedQuestion from '../models/SolvedQuestion.js'
import moment from 'moment'

// Get progress metrics for a user
const getUserProgress = async (req, res) => {
    const userId = req.user._id
    const { type, section, difficulty } = req.query

    try {
        // Build a filter object for querying the solved questions
        let query = { userId }
        if (type) query.type = type
        if (section) query.section = section
        if (difficulty) query.difficulty = difficulty

        // Get unique questions count
        const uniqueQuestions = await SolvedQuestion.distinct('questionNumber', query)
        const solvedQuestions = await SolvedQuestion.find(query)

        // Calculate the progress metrics
        const totalQuestionsSolved = uniqueQuestions.length
        const totalAccuracy = solvedQuestions.reduce((acc, q) => acc + q.accuracy, 0)
        const totalTimeSpent = solvedQuestions.reduce((acc, q) => acc + q.timeSpent, 0)
        const averageAccuracy = solvedQuestions.length ? (totalAccuracy / solvedQuestions.length) : 0
        const averageTimeSpent = solvedQuestions.length ? (totalTimeSpent / solvedQuestions.length) : 0

        res.json({
            totalQuestionsSolved,
            totalTimeSpent,
            averageAccuracy,
            averageTimeSpent
        })
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
}

// Get activity data for calendar
const getActivityData = async (req, res) => {
    const { startDate, endDate, userId } = req.query

    try {
        const solvedQuestions = await SolvedQuestion.find({
            userId,
            solvedAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        })

        // Group questions by date
        const activityData = solvedQuestions.reduce((acc, question) => {
            const date = moment(question.solvedAt).format('YYYY-MM-DD')
            acc[date] = (acc[date] || 0) + 1
            return acc
        }, {})

        res.json(activityData)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export { getUserProgress, getActivityData }