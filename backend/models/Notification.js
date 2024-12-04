import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['reply', 'like', 'mention'],
        required: true
    },
    discussionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Discussion'
    },
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

export default mongoose.model('Notification', notificationSchema) 