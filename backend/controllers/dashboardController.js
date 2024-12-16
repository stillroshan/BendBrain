import SolvedQuestion from '../models/SolvedQuestion.js'
import DashboardProgress from '../models/DashboardProgress.js'
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

        // Get unique solved questions count (only status='Solved')
        const uniqueQuestions = await SolvedQuestion.distinct('questionNumber', { ...query, status: 'Solved' })
        
        // Get all attempts for other metrics
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

// Get progress for all lists
const getListsProgress = async (req, res) => {
    try {
        let progress = await DashboardProgress.findOne({ user: req.user._id })
            .populate('questionLists.list', 'title metadata')
            
        if (!progress) {
            progress = new DashboardProgress({ user: req.user._id })
            await progress.save()
        }

        res.json(progress.questionLists)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Update progress for a specific list
const updateListProgress = async (req, res) => {
    try {
        const { listId, questionId } = req.body
        let progress = await DashboardProgress.findOne({ user: req.user._id })
        
        if (!progress) {
            progress = new DashboardProgress({ user: req.user._id })
        }

        await progress.updateListProgress(listId, questionId)
        
        // Add to recent activity
        progress.recentActivity.unshift({
            type: 'SOLVED',
            questionId,
            listId,
            timestamp: new Date()
        })

        // Keep only last 20 activities
        if (progress.recentActivity.length > 20) {
            progress.recentActivity = progress.recentActivity.slice(0, 20)
        }

        await progress.save()
        res.json(progress.questionLists.find(p => p.list.toString() === listId))
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get recent activity for lists
const getListsActivity = async (req, res) => {
    try {
        const progress = await DashboardProgress.findOne({ user: req.user._id })
            .populate('recentActivity.questionId', 'title')
            .populate('recentActivity.listId', 'title')
            
        if (!progress) {
            return res.json([])
        }

        res.json(progress.recentActivity)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export { 
    getUserProgress, 
    getActivityData, 
    getListsProgress, 
    updateListProgress, 
    getListsActivity 
}