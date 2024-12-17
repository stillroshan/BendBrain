import QuestionList from '../models/QuestionList.js'
import Question from '../models/Question.js'

// Create a new question list
const createList = async (req, res) => {
    try {
        const { title, questions, visibility } = req.body
        const creator = req.user._id

        // Validate questions exist and create ordered questions array
        const orderedQuestions = []
        for (let i = 0; i < questions.length; i++) {
            const questionNumber = questions[i]
            const question = await Question.findOne({ questionNumber })
            if (!question) {
                return res.status(400).json({ message: `Question ${questionNumber} not found` })
            }
            orderedQuestions.push({
                question: questionNumber,
                orderNumber: i + 1
            })
        }

        const list = new QuestionList({
            title,
            creator,
            questions: orderedQuestions,
            visibility
        })

        const savedList = await list.save()
        res.status(201).json(savedList)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Get all lists (public + user's private lists)
const getLists = async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query
        const userId = req.user?._id

        let query = {
            $or: [
                { visibility: 'public' },
                { creator: userId }
            ]
        }

        if (search) {
            query.title = { $regex: search, $options: 'i' }
        }

        const lists = await QuestionList.find(query)
            .populate('creator', 'username')
            .sort('-createdAt')
            .skip((page - 1) * limit)
            .limit(limit)

        const total = await QuestionList.countDocuments(query)

        res.json({
            lists,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get list by ID
const getListById = async (req, res) => {
    try {
        const list = await QuestionList.findById(req.params.id)
            .populate('creator', 'username')
            .populate({
                path: 'questions.question',
                model: 'Question',
                select: 'questionNumber title difficulty type'
            })

        if (!list) {
            return res.status(404).json({ message: 'List not found' })
        }

        // Check if user can access private list
        if (list.visibility === 'private' && (!req.user || list.creator._id.toString() !== req.user._id.toString())) {
            return res.status(403).json({ message: 'Not authorized to view this list' })
        }

        res.json(list)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Update list
const updateList = async (req, res) => {
    try {
        const { title, questions, visibility } = req.body
        const list = await QuestionList.findById(req.params.id)

        if (!list) {
            return res.status(404).json({ message: 'List not found' })
        }

        // Check ownership
        if (list.creator.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this list' })
        }

        // Validate and order questions if provided
        if (questions) {
            const orderedQuestions = []
            for (let i = 0; i < questions.length; i++) {
                const questionNumber = questions[i]
                const question = await Question.findOne({ questionNumber })
                if (!question) {
                    return res.status(400).json({ message: `Question ${questionNumber} not found` })
                }
                orderedQuestions.push({
                    question: questionNumber,
                    orderNumber: i + 1
                })
            }
            list.questions = orderedQuestions
        }

        list.title = title || list.title
        list.visibility = visibility || list.visibility

        const updatedList = await list.save()
        res.json(updatedList)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Delete list
const deleteList = async (req, res) => {
    try {
        const list = await QuestionList.findById(req.params.id)

        if (!list) {
            return res.status(404).json({ message: 'List not found' })
        }

        // Check ownership
        if (list.creator.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this list' })
        }

        await list.deleteOne()
        res.json({ message: 'List removed' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Toggle save list
const toggleSaveList = async (req, res) => {
    try {
        const list = await QuestionList.findById(req.params.id)
        if (!list) {
            return res.status(404).json({ message: 'List not found' })
        }

        const userId = req.user._id
        const savedIndex = list.savedBy.indexOf(userId)

        if (savedIndex === -1) {
            list.savedBy.push(userId)
        } else {
            list.savedBy.splice(savedIndex, 1)
        }

        await list.save()
        res.json({ message: 'List updated successfully' })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export { createList, getLists, getListById, updateList, deleteList, toggleSaveList } 