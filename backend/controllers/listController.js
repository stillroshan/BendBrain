import List from '../models/List.js'
import User from '../models/User.js'

// Create a new list
const createList = async (req, res) => {
    try {
        const { title, questions, visibility } = req.body
        const creator = req.user._id

        const list = new List({
            title,
            creator,
            questions: questions.map((q, index) => ({
                question: q,
                order: index + 1
            })),
            visibility
        })

        const savedList = await list.save()
        const populatedList = await List.findById(savedList._id)
            .populate('creator', 'username')
            .populate('questions.question')
        
        res.status(201).json(populatedList)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Get all lists for a user (created and saved)
const getLists = async (req, res) => {
    try {
        const userId = req.user._id

        const lists = await List.find({
            $or: [
                { creator: userId },
                { savedBy: userId }
            ]
        })
        .populate('questions.question')
        .populate('creator', 'username')
        .sort({ isFavorites: -1, createdAt: -1 })
        .lean()

        if (!lists) {
            return res.json([]) // Return empty array if no lists found
        }

        res.json(lists)
    } catch (error) {
        console.error('Error in getLists:', error) // Add server-side logging
        res.status(500).json({ 
            message: 'Error fetching lists',
            error: error.message 
        })
    }
}

// Get a single list by ID
const getListById = async (req, res) => {
    try {
        const list = await List.findById(req.params.id)
            .populate('questions.question')
            .populate('creator', 'username')
            .populate('savedBy')

        if (!list) {
            return res.status(404).json({ message: 'List not found' })
        }

        // Check if user has access to the list
        const userId = req.user._id.toString()
        const creatorId = list.creator._id.toString()
        const savedByIds = list.savedBy.map(id => id.toString())

        if (list.visibility === 'private' && 
            creatorId !== userId &&
            !savedByIds.includes(userId)) {
            return res.status(403).json({ 
                message: 'Access denied: This list is private',
                details: {
                    visibility: list.visibility,
                    isCreator: creatorId === userId,
                    isSaved: savedByIds.includes(userId)
                }
            })
        }

        res.json(list)
    } catch (error) {
        console.error('Error in getListById:', error)
        res.status(500).json({ 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        })
    }
}

// Update a list
const updateList = async (req, res) => {
    try {
        const list = await List.findById(req.params.id)
        
        if (!list) {
            return res.status(404).json({ message: 'List not found' })
        }

        // Only creator can update the list
        if (list.creator.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' })
        }

        const { title, questions, visibility } = req.body
        
        list.title = title
        list.visibility = visibility
        list.questions = questions.map((q, index) => ({
            question: q,
            order: index + 1
        }))

        const updatedList = await list.save()
        res.json(updatedList)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Delete a list
const deleteList = async (req, res) => {
    try {
        const list = await List.findById(req.params.id)
        
        if (!list) {
            return res.status(404).json({ message: 'List not found' })
        }

        // Only creator can delete the list
        if (list.creator.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' })
        }

        if (list.isFavorites) {
            return res.status(400).json({ message: 'Cannot delete favorites list' })
        }

        await list.remove()
        res.json({ message: 'List deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Save/unsave a list
const toggleSaveList = async (req, res) => {
    try {
        const list = await List.findById(req.params.id)
        
        if (!list) {
            return res.status(404).json({ message: 'List not found' })
        }

        const userId = req.user._id

        if (list.savedBy.includes(userId)) {
            list.savedBy = list.savedBy.filter(id => id.toString() !== userId.toString())
        } else {
            if (list.visibility === 'private' && list.creator.toString() !== userId.toString()) {
                return res.status(403).json({ message: 'Cannot save private list' })
            }
            list.savedBy.push(userId)
        }

        await list.save()
        res.json({ message: 'List save status toggled successfully' })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Fork a list
const forkList = async (req, res) => {
    try {
        const originalList = await List.findById(req.params.id)
        
        if (!originalList) {
            return res.status(404).json({ message: 'List not found' })
        }

        if (originalList.visibility === 'private' && 
            originalList.creator.toString() !== req.user._id.toString() &&
            !originalList.savedBy.includes(req.user._id)) {
            return res.status(403).json({ message: 'Cannot fork private list' })
        }

        const { title } = req.body

        const newList = new List({
            title,
            creator: req.user._id,
            questions: originalList.questions,
            visibility: 'private'
        })

        const savedList = await newList.save()
        res.status(201).json(savedList)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export {
    createList,
    getLists,
    getListById,
    updateList,
    deleteList,
    toggleSaveList,
    forkList
} 