import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    examType: {
        type: String,
        enum: ['CAT', 'GMAT', 'SAT', 'GRE', 'UPSC', 'RRB', 'SSC', 'BANK PO'],
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
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

export default mongoose.model('Course', courseSchema) 