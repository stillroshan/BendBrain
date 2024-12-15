import mongoose from 'mongoose'

const subjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    topics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic'
    }],
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

export default mongoose.model('Subject', subjectSchema) 