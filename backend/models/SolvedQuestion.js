import mongoose from 'mongoose'

const solvedQuestionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    section: {
        type: String,
        Enum: ['Numerical Ability', 'Verbal Reasoning', 'Non-verbal Reasoning', 'Verbal Ability', 'Quantitative Aptitude', 'Data Interpretation'],
        required: true
    },
    type: {
        type: String,
        Enum: ['MCQ', 'Integer'],
        required: true
    },
    difficulty: {
        type: String,
        Enum: ['Easy', 'Medium', 'Hard'],
        required: true
    },
    attempts: {
        type: Number,
        required: true
    },
    accuracy: {
        type: Number,
        required: true
    },
    timeSpent: {
        type: Number,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    percentile: {
        type: Number,
        default: 0
    },
    solvedAt: {
        type: Date,
        default: Date.now
    },
    pastAttempts: [
        {
            accuracy: Number,
            timeSpent: Number,
            percentile: {
                type: Number,
                default: 0
            },
            attemptedAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
})

const SolvedQuestion = mongoose.model('SolvedQuestion', solvedQuestionSchema)

export default SolvedQuestion