import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema({
    questionId: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String, 
        required: true
    },
    statement: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['MCQ', 'Integer'],
        required: true
    },
    options: {
        type: String,
        required: function() {
            return this.type === 'MCQ'
        }
    },
    answer: {
        type: String,
        required: true
    },
    hint: {
        type: String
    },
    explanation: {
        type: String
    },
    section: {
        type: String,
        enum: ['Numerical Ability', 'Verbal Reasoning', 'Non-verbal Reasoning', 'Verbal Ability', 'Quantitative Aptitude', 'Data Interpretation'],
        required: true
    },
    status: {
        type: String,
        enum: ['Solved', 'Unsolved', 'Attempted'],
        default: 'Unsolved'
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true
    }
}, { timestamps: true})

const Question = mongoose.model('Question', questionSchema)

export default Question