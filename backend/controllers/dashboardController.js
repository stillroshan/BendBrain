import SolvedQuestion from '../models/SolvedQuestion.js'
import Question from '../models/Question.js'
import DashboardProgress from '../models/DashboardProgress.js'
import moment from 'moment'

// Get progress metrics for a user
const getUserProgress = async (req, res) => {
    try {
        const userId = req.user._id

        // Get only uniquely solved questions (status = 'Solved')
        const solvedQuestions = await SolvedQuestion.distinct('questionNumber', { 
            userId, 
            status: 'Solved' 
        })

        // Get attempted but not solved questions
        const attemptedQuestions = await SolvedQuestion.distinct('questionNumber', { 
            userId, 
            status: 'Attempted' 
        })

        // Calculate total questions by difficulty
        const totalQuestions = {
            easy: await Question.countDocuments({ difficulty: 'Easy' }),
            medium: await Question.countDocuments({ difficulty: 'Medium' }),
            hard: await Question.countDocuments({ difficulty: 'Hard' })
        }

        // Get all solved questions with their difficulties
        // First, get the latest status for each question
        const latestStatusByQuestion = await SolvedQuestion.aggregate([
            { 
                $match: { 
                    userId: userId
                }
            },
            {
                $sort: { createdAt: -1 } // Sort by latest attempt
            },
            {
                $group: {
                    _id: '$questionNumber',
                    latestStatus: { $first: '$status' },
                    difficulty: { $first: '$difficulty' }
                }
            },
            {
                $match: {
                    latestStatus: 'Solved' // Only keep questions that are actually solved
                }
            },
            {
                $group: {
                    _id: '$difficulty',
                    count: { $sum: 1 }
                }
            }
        ])

        // Format difficulty breakdown
        const difficultyBreakdown = {
            easy: 0,
            medium: 0,
            hard: 0
        }

        latestStatusByQuestion.forEach(item => {
            if (item._id === 'Easy') difficultyBreakdown.easy = item.count
            if (item._id === 'Medium') difficultyBreakdown.medium = item.count
            if (item._id === 'Hard') difficultyBreakdown.hard = item.count
        })

        // Get total number of attempts (all entries for this user)
        const totalAttempts = await SolvedQuestion.countDocuments({ userId })

        // Calculate total time across all attempts
        const timeResult = await SolvedQuestion.aggregate([
            { $match: { userId } },
            { $group: { 
                _id: null, 
                totalTime: { $sum: '$timeSpent' } 
            }}
        ])
        const totalTimeSpent = timeResult[0]?.totalTime || 0

        // Calculate metrics
        const totalQuestionsSolved = solvedQuestions.length
        const totalQuestionsAttempted = attemptedQuestions.length
        
        // Average accuracy = (solved questions / total attempts) * 100
        const averageAccuracy = totalAttempts > 0 
            ? (totalQuestionsSolved / totalAttempts) * 100 
            : 0

        // Average time = total time / total attempts
        const averageTimeSpent = totalAttempts > 0 
            ? totalTimeSpent / totalAttempts 
            : 0

        res.json({
            totalQuestionsSolved,
            totalQuestionsAttempted,
            totalAttempts,
            totalTimeSpent,
            averageAccuracy: Math.round(averageAccuracy * 100) / 100,
            averageTimeSpent: Math.round(averageTimeSpent * 100) / 100,
            difficultyBreakdown,
            totalQuestions
        })

    } catch (error) {
        console.error('Error in getUserProgress:', error)
        res.status(500).json({ 
            message: 'Error fetching user progress',
            error: error.message 
        })
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