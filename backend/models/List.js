import mongoose from 'mongoose'

const listItemSchema = new mongoose.Schema({
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    order: {
        type: Number,
        required: true
    }
})

const listSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questions: [listItemSchema],
    visibility: {
        type: String,
        enum: ['public', 'private'],
        default: 'private'
    },
    isFavorites: {
        type: Boolean,
        default: false
    },
    savedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true })

// Ensure favorite lists can't be deleted
listSchema.pre('remove', function(next) {
    if (this.isFavorites) {
        next(new Error('Cannot delete favorites list'))
    }
    next()
})

export default mongoose.model('List', listSchema) 