import mongoose from 'mongoose' 

const questionListSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
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
        type: Number,
        ref: 'Question'
    }],
    isPublic: {
        type: Boolean,
        default: true
    },
    tags: [{
        type: String
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    totalQuestions: {
        type: Number,
        default: 0
    }
}, { timestamps: true }) 

// Add virtual for progress tracking
questionListSchema.virtual('progress').get(function() {
    return {
        solved: this.questions.filter(question => question.solved).length,
        total: this.questions.length
    }
})

const QuestionList = mongoose.model('QuestionList', questionListSchema) 
export default QuestionList