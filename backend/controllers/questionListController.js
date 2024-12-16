import QuestionList from '../models/QuestionList.js'
import DashboardProgress from '../models/DashboardProgress.js'
import Question from '../models/Question.js'

// Get all question lists with filtering, sorting, and pagination
export const getQuestionLists = async (req, res) => {
    try {
        const { 
            category, 
            difficulty, 
            search, 
            sortBy = 'popular', // popular, recent, solved
            page = 1,
            limit = 10
        } = req.query

        let query = { visibility: 'Public' }
        let sort = {}

        // Build query filters
        if (category) query.category = category
        if (difficulty) query.difficulty = difficulty
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ]
        }

        // Handle sorting
        switch (sortBy) {
            case 'popular':
                sort = { 'stats.saves': -1, 'stats.likes': -1 }
                break
            case 'recent':
                sort = { createdAt: -1 }
                break
            case 'solved':
                sort = { 'stats.completions': -1 }
                break
            default:
                sort = { 'stats.saves': -1 }
        }

        // Add official lists at top
        sort.isOfficial = -1

        const total = await QuestionList.countDocuments(query)
        const lists = await QuestionList.find(query)
            .populate('creator', 'username profilePicture')
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()

        // Add progress information for authenticated users
        if (req.user) {
            const progress = await DashboardProgress.findOne({ user: req.user._id })
            if (progress) {
                lists.forEach(list => {
                    const listProgress = progress.questionLists.find(
                        p => p.list.toString() === list._id.toString()
                    )
                    if (listProgress) {
                        list.userProgress = {
                            completionPercentage: listProgress.completionPercentage,
                            solvedCount: listProgress.solvedQuestions.length,
                            lastAttempted: listProgress.lastAttempted
                        }
                    }
                })
            }
        }

        res.json({
            lists,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page: Number(page),
                limit: Number(limit)
            }
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get user's created and saved lists
export const getUserLists = async (req, res) => {
    try {
        const [createdLists, savedLists] = await Promise.all([
            QuestionList.find({ creator: req.user._id })
                .populate('creator', 'username profilePicture')
                .sort({ createdAt: -1 })
                .lean(),
            QuestionList.find({ 'stats.saves': req.user._id })
                .populate('creator', 'username profilePicture')
                .sort({ createdAt: -1 })
                .lean()
        ])

        // Add progress information
        const progress = await DashboardProgress.findOne({ user: req.user._id })
        if (progress) {
            const addProgress = (list) => {
                const listProgress = progress.questionLists.find(
                    p => p.list.toString() === list._id.toString()
                )
                if (listProgress) {
                    list.userProgress = {
                        completionPercentage: listProgress.completionPercentage,
                        solvedCount: listProgress.solvedQuestions.length,
                        lastAttempted: listProgress.lastAttempted
                    }
                }
                return list
            }

            createdLists.forEach(addProgress)
            savedLists.forEach(addProgress)
        }

        res.json({ createdLists, savedLists })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Toggle save list
export const toggleSaveList = async (req, res) => {
    try {
        const list = await QuestionList.findById(req.params.id)
        if (!list) {
            return res.status(404).json({ message: 'List not found' })
        }

        const userSavedIndex = list.stats.saves.indexOf(req.user._id)
        if (userSavedIndex === -1) {
            list.stats.saves.push(req.user._id)
        } else {
            list.stats.saves.splice(userSavedIndex, 1)
        }

        await list.save()
        res.json({ saved: userSavedIndex === -1 })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Toggle like list
export const toggleLikeList = async (req, res) => {
    try {
        const list = await QuestionList.findById(req.params.id)
        if (!list) {
            return res.status(404).json({ message: 'List not found' })
        }

        const userLikedIndex = list.stats.likes.indexOf(req.user._id)
        if (userLikedIndex === -1) {
            list.stats.likes.push(req.user._id)
        } else {
            list.stats.likes.splice(userLikedIndex, 1)
        }

        await list.save()
        res.json({ liked: userLikedIndex === -1 })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get list details with questions and progress
export const getQuestionListById = async (req, res) => {
    try {
        const list = await QuestionList.findById(req.params.id)
            .populate('creator', 'username profilePicture')
            .populate({
                path: 'questions.questionId',
                select: 'title difficulty section type avgAccuracy avgTimeSpent'
            })
            .lean()

        if (!list) {
            return res.status(404).json({ message: 'Question list not found' })
        }

        // Check visibility permissions
        if (list.visibility === 'Private' && 
            (!req.user || (list.creator._id.toString() !== req.user._id.toString() && !req.user.isAdmin))) {
            return res.status(403).json({ message: 'Access denied' })
        }

        // Add user-specific data for authenticated users
        if (req.user) {
            // Get progress
            const progress = await DashboardProgress.findOne({ user: req.user._id })
            if (progress) {
                const listProgress = progress.questionLists.find(
                    p => p.list.toString() === list._id.toString()
                )
                if (listProgress) {
                    list.userProgress = {
                        completionPercentage: listProgress.completionPercentage,
                        solvedQuestions: listProgress.solvedQuestions,
                        lastAttempted: listProgress.lastAttempted
                    }
                }
            }

            // Add saved/liked status
            list.userInteraction = {
                saved: list.stats.saves.includes(req.user._id),
                liked: list.stats.likes.includes(req.user._id)
            }

            // Add solved status to each question
            const solvedQuestions = await Question.find({
                userId: req.user._id,
                questionId: { $in: list.questions.map(q => q.questionId._id) },
                status: 'Solved'
            })

            list.questions = list.questions.map(q => ({
                ...q,
                solved: solvedQuestions.some(sq => sq.questionId.equals(q.questionId._id))
            }))
        }

        res.json(list)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Create new question list
export const createQuestionList = async (req, res) => {
    try {
        const { 
            title, 
            description, 
            questions, 
            category, 
            visibility, 
            tags 
        } = req.body

        const list = new QuestionList({
            title,
            description,
            creator: req.user._id,
            questions: questions.map((q, index) => ({ 
                questionId: q, 
                order: index + 1 
            })),
            category,
            visibility,
            tags,
            isOfficial: req.user.isAdmin
        })

        await list.save()
        res.status(201).json(await list.populate('creator', 'username profilePicture'))
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Update question list
export const updateQuestionList = async (req, res) => {
    try {
        const list = await QuestionList.findById(req.params.id)
        if (!list) {
            return res.status(404).json({ message: 'List not found' })
        }

        // Check ownership
        if (list.creator.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized' })
        }

        const updates = req.body
        Object.keys(updates).forEach(key => {
            if (key === 'questions') {
                list.questions = updates.questions.map((q, index) => ({
                    questionId: q,
                    order: index + 1
                }))
            } else {
                list[key] = updates[key]
            }
        })

        await list.save()
        res.json(await list.populate('creator', 'username profilePicture'))
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Delete question list
export const deleteQuestionList = async (req, res) => {
    try {
        const list = await QuestionList.findById(req.params.id)
        if (!list) {
            return res.status(404).json({ message: 'List not found' })
        }

        // Check ownership
        if (list.creator.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized' })
        }

        await list.remove()
        res.json({ message: 'List deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
