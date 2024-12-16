import mongoose from 'mongoose'

const questionListSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questions: [{
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        },
        order: Number
    }],
    category: {
        type: String,
        enum: ['Interview Prep', 'Topic Wise', 'Company Specific', 'Custom'],
        default: 'Custom'
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard', 'Mixed'],
        default: 'Mixed'
    },
    visibility: {
        type: String,
        enum: ['Public', 'Private', 'Unlisted'],
        default: 'Public'
    },
    isOfficial: {
        type: Boolean,
        default: false
    },
    tags: [{
        type: String,
        trim: true
    }],
    metadata: {
        totalQuestions: { type: Number, default: 0 },
        difficultyDistribution: {
            easy: { type: Number, default: 0 },
            medium: { type: Number, default: 0 },
            hard: { type: Number, default: 0 }
        },
        topicDistribution: {
            type: Map,
            of: Number
        }
    },
    stats: {
        views: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
        saves: { type: Number, default: 0 },
        completions: { type: Number, default: 0 },
        averageCompletion: { type: Number, default: 0 }
    },
}, {
    timestamps: true
})

// Virtual for getting completion status
questionListSchema.virtual('completionStatus').get(function() {
    return {
        total: this.metadata.totalQuestions,
        distribution: this.metadata.difficultyDistribution,
        topics: Object.fromEntries(this.metadata.topicDistribution || new Map())
    }
})

// Method to update progress when a question is solved
questionListSchema.methods.updateProgress = async function(userId, questionId) {
    let progress = this.userProgress.find(p => p.user.toString() === userId.toString())
    
    if (!progress) {
        progress = {
            user: userId,
            solvedQuestions: [],
            lastAttempted: new Date(),
            completionPercentage: 0
        }
        this.userProgress.push(progress)
    }

    if (!progress.solvedQuestions.includes(questionId)) {
        progress.solvedQuestions.push(questionId)
        progress.completionPercentage = (progress.solvedQuestions.length / this.metadata.totalQuestions) * 100
    }

    progress.lastAttempted = new Date()
    await this.save()
}

// Pre-save hook to update metadata
questionListSchema.pre('save', async function(next) {
    if (this.isModified('questions')) {
        this.metadata.totalQuestions = this.questions.length
        
        // Update difficulty distribution
        const questions = await mongoose.model('Question').find({
            '_id': { $in: this.questions.map(q => q.questionId) }
        })
        
        this.metadata.difficultyDistribution = questions.reduce((acc, q) => {
            acc[q.difficulty.toLowerCase()]++
            return acc
        }, { easy: 0, medium: 0, hard: 0 })

        // Update topic distribution
        const topicMap = new Map()
        questions.forEach(q => {
            const count = topicMap.get(q.section) || 0
            topicMap.set(q.section, count + 1)
        })
        this.metadata.topicDistribution = topicMap
    }
    next()
})

const QuestionList = mongoose.model('QuestionList', questionListSchema)
export default QuestionList