import mongoose from 'mongoose'

const dashboardProgressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questionLists: [{
        list: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'QuestionList'
        },
        solvedQuestions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        }],
        lastAttempted: Date,
        completionPercentage: Number
    }],
    overallProgress: {
        totalSolved: { type: Number, default: 0 },
        difficultyBreakdown: {
            easy: { type: Number, default: 0 },
            medium: { type: Number, default: 0 },
            hard: { type: Number, default: 0 }
        },
        topicBreakdown: {
            type: Map,
            of: Number,
            default: new Map()
        },
        streakData: {
            currentStreak: { type: Number, default: 0 },
            longestStreak: { type: Number, default: 0 },
            lastSolveDate: Date
        }
    },
    recentActivity: [{
        type: {
            type: String,
            enum: ['SOLVED', 'ATTEMPTED', 'LIST_STARTED', 'LIST_COMPLETED'],
            required: true
        },
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        },
        listId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'QuestionList'
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
})

// Method to update list progress
dashboardProgressSchema.methods.updateListProgress = async function(listId, questionId) {
    let listProgress = this.questionLists.find(p => p.list.toString() === listId.toString())
    
    if (!listProgress) {
        const list = await mongoose.model('QuestionList').findById(listId)
        listProgress = {
            list: listId,
            solvedQuestions: [],
            lastAttempted: new Date(),
            completionPercentage: 0
        }
        this.questionLists.push(listProgress)
    }

    if (!listProgress.solvedQuestions.includes(questionId)) {
        listProgress.solvedQuestions.push(questionId)
        const list = await mongoose.model('QuestionList').findById(listId)
        listProgress.completionPercentage = (listProgress.solvedQuestions.length / list.metadata.totalQuestions) * 100
    }

    listProgress.lastAttempted = new Date()
    await this.save()
}

// Method to update streak
dashboardProgressSchema.methods.updateStreak = function() {
    const today = new Date()
    const lastSolve = this.overallProgress.streakData.lastSolveDate

    if (!lastSolve) {
        this.overallProgress.streakData.currentStreak = 1
    } else {
        const diffDays = Math.floor((today - lastSolve) / (1000 * 60 * 60 * 24))
        
        if (diffDays === 0) return // Already solved today
        else if (diffDays === 1) this.overallProgress.streakData.currentStreak++
        else this.overallProgress.streakData.currentStreak = 1
    }

    this.overallProgress.streakData.lastSolveDate = today
    this.overallProgress.streakData.longestStreak = Math.max(
        this.overallProgress.streakData.longestStreak,
        this.overallProgress.streakData.currentStreak
    )
}

const DashboardProgress = mongoose.model('DashboardProgress', dashboardProgressSchema)
export default DashboardProgress 