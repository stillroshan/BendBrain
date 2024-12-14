import QuestionList from '../models/QuestionList.js'
import User from '../models/User.js'
import SolvedQuestion from '../models/SolvedQuestion.js'

// Get all question lists with advanced filtering and sorting
const getQuestionLists = async (req, res) => {
    try {
        const { 
            search,
            creator,
            tags,
            isPublic,
            isOfficial,
            sort = 'recent',
            page = 1,
            limit = 10
        } = req.query

        // Build query
        let query = {}
        
        // Search across multiple fields
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ]
            
            // Add creator search if it's a username
            const creator = await User.findOne({ 
                username: { $regex: search, $options: 'i' } 
            })
            if (creator) {
                query.$or.push({ creator: creator._id })
            }
        }

        // Filter by specific creator
        if (creator) {
            const creatorUser = await User.findOne({ username: creator })
            if (creatorUser) {
                query.creator = creatorUser._id
            }
        }

        // Filter by tags
        if (tags) {
            const tagArray = tags.split(',').map(tag => tag.trim())
            query.tags = { $in: tagArray }
        }

        // Filter by visibility
        if (isPublic !== undefined) {
            query.isPublic = isPublic === 'true'
        }

        if (isOfficial !== undefined) {
            query.isOfficial = isOfficial === 'true'
        }

        // Handle private lists visibility
        if (!req.user?.isAdmin) {
            query = {
                $or: [
                    { isPublic: true },
                    { creator: req.user?._id }
                ]
            }
        }

        // Build sort options
        let sortOption = {}
        switch (sort) {
            case 'relevancy':
                // Complex sorting based on multiple factors
                sortOption = {
                    isOfficial: -1,
                    'likes.length': -1,
                    totalQuestions: -1,
                    createdAt: -1
                }
                break
            case 'likes':
                sortOption = { 'likes.length': -1 }
                break
            case 'questions':
                sortOption = { totalQuestions: -1 }
                break
            default: // 'recent'
                sortOption = { createdAt: -1 }
        }

        // Pagination
        const skip = (page - 1) * limit

        // Execute query with pagination
        const lists = await QuestionList.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .populate('creator', 'username profilePicture')
            .lean()

        // Get total count for pagination
        const total = await QuestionList.countDocuments(query)

        // Add progress for authenticated users
        if (req.user) {
            const solvedQuestions = await SolvedQuestion.find({ 
                userId: req.user._id,
                status: 'Solved'
            })

            const solvedSet = new Set(solvedQuestions.map(sq => sq.questionNumber))

            lists.forEach(list => {
                const solved = list.questions.filter(qNum => solvedSet.has(qNum)).length
                list.progress = {
                    solved,
                    total: list.questions.length,
                    percentage: (solved / list.questions.length * 100).toFixed(1)
                }
            })
        }

        res.json({
            lists,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page: parseInt(page),
                limit: parseInt(limit)
            }
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Create new question list
const createQuestionList = async (req, res) => {
    try {
        const { 
            title, 
            description, 
            questions, 
            isPublic, 
            tags
        } = req.body

        const list = new QuestionList({
            title,
            description,
            creator: req.user._id,
            questions,
            isPublic,
            tags,
            totalQuestions: questions.length,
            isOfficial: req.user.isAdmin
        })

        const savedList = await list.save()
        await savedList.populate('creator', 'username profilePicture')

        res.status(201).json(savedList)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Get question list by ID
const getQuestionListById = async (req, res) => {
    try {
        const list = await QuestionList.findById(req.params.id)
            .populate('creator', 'username profilePicture')
            .lean()

        if (!list) {
            return res.status(404).json({ message: 'Question list not found' })
        }

        // Check if user has access to private list
        if (!list.isPublic && (!req.user || (list.creator._id.toString() !== req.user._id.toString() && !req.user.isAdmin))) {
            return res.status(403).json({ message: 'Access denied' })
        }

        // Add progress for authenticated users
        if (req.user) {
            const solvedQuestions = await SolvedQuestion.find({
                userId: req.user._id,
                questionNumber: { $in: list.questions },
                status: 'Solved'
            })

            list.progress = {
                solved: solvedQuestions.length,
                total: list.questions.length,
                percentage: (solvedQuestions.length / list.questions.length * 100).toFixed(1)
            }
        }

        res.json(list)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Update question list
const updateQuestionList = async (req, res) => {
    try {
        const list = await QuestionList.findById(req.params.id)

        if (!list) {
            return res.status(404).json({ message: 'Question list not found' })
        }

        // Check ownership or admin status
        if (list.creator.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized' })
        }

        const {
            title,
            description,
            questions,
            isPublic,
            tags
        } = req.body

        list.title = title || list.title
        list.description = description || list.description
        list.questions = questions || list.questions
        list.isPublic = isPublic !== undefined ? isPublic : list.isPublic
        list.tags = tags || list.tags
        list.totalQuestions = questions ? questions.length : list.totalQuestions

        const updatedList = await list.save()
        await updatedList.populate('creator', 'username profilePicture')

        res.json(updatedList)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Delete question list
const deleteQuestionList = async (req, res) => {
    try {
        const list = await QuestionList.findById(req.params.id)

        if (!list) {
            return res.status(404).json({ message: 'Question list not found' })
        }

        // Check ownership or admin status
        if (list.creator.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized' })
        }

        await list.remove()
        res.json({ message: 'Question list removed' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Toggle like on question list
const toggleLike = async (req, res) => {
    try {
        const list = await QuestionList.findById(req.params.id)

        if (!list) {
            return res.status(404).json({ message: 'Question list not found' })
        }

        const likeIndex = list.likes.indexOf(req.user._id)

        if (likeIndex === -1) {
            list.likes.push(req.user._id)
        } else {
            list.likes.splice(likeIndex, 1)
        }

        await list.save()
        res.json({ likes: list.likes.length })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export {
    getQuestionLists,
    createQuestionList,
    getQuestionListById,
    updateQuestionList,
    deleteQuestionList,
    toggleLike
}
