import mongoose from 'mongoose'

const questionListSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questions: [{
        question: {
            type: Number,
            ref: 'Question',
            required: true
        },
        orderNumber: {
            type: Number,
            required: true
        }
    }],
    visibility: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'
    },
    savedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isFavorites: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

// Create favorites list for new users
questionListSchema.statics.createFavoritesList = async function(userId) {
    const favoritesList = new this({
        title: 'Favorites',
        creator: userId,
        visibility: 'public',
        isFavorites: true
    })
    return favoritesList.save()
}

export default mongoose.model('QuestionList', questionListSchema)