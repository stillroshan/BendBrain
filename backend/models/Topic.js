import mongoose from 'mongoose'

const topicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    headings: [{
        id: String,
        title: String,
        level: Number
    }],
    order: {
        type: Number,
        required: true
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true })

export default mongoose.model('Topic', topicSchema) 