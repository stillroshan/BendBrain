import List from '../models/List.js'
import User from '../models/User.js'

// Create a new list
const createList = async (req, res) => {
    try {
        const { title, questions, visibility } = req.body
        const creator = req.user._id

        // Validation
        if (!title) {
            return res.status(400).json({ message: 'Title is required' })
        }
        if (!Array.isArray(questions)) {
            return res.status(400).json({ message: 'Questions must be an array' })
        }

        // Create the questions array with proper structure
        const formattedQuestions = questions.map(q => ({
            question: q.question, // This should now be just the ID string
            order: q.order
        }))

        const list = new List({
            title,
            creator,
            questions: formattedQuestions,
            visibility: visibility || 'private'
        })

        const savedList = await list.save()
        const populatedList = await List.findById(savedList._id)
            .populate('creator', 'username')
            .populate('questions.question')
        
        res.status(201).json(populatedList)
    } catch (error) {
        console.error('Error creating list:', error) // Add server-side logging
        res.status(400).json({ 
            message: error.message,
            details: error.errors // Include mongoose validation errors if any
        })
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
        
        // Validate the questions array
        if (!Array.isArray(questions)) {
            return res.status(400).json({ message: 'Questions must be an array' })
        }

        // Validate each question has the required fields
        for (const q of questions) {
            if (!q.question || !q.order) {
                return res.status(400).json({ 
                    message: 'Each question must have question ID and order',
                    received: q
                })
            }
        }

        list.title = title
        list.visibility = visibility
        list.questions = questions // Use the questions array directly

        const updatedList = await list.save()
        
        // Populate the response
        const populatedList = await List.findById(updatedList._id)
            .populate('creator', 'username')
            .populate('questions.question')

        res.json(populatedList)
    } catch (error) {
        console.error('Error updating list:', error)
        res.status(400).json({ 
            message: error.message,
            details: error.errors // Include mongoose validation errors if any
        })
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

        await List.deleteOne({ _id: list._id })
        res.json({ message: 'List deleted successfully' })
    } catch (error) {
        console.error('Error deleting list:', error) // Add server-side logging
        res.status(500).json({ 
            message: 'Error deleting list',
            error: error.message 
        })
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
        
        // Return the populated list instead of just a message
        const populatedList = await List.findById(list._id)
            .populate('creator', 'username')
            .populate('questions.question')
            .populate('savedBy')
        
        res.json(populatedList)
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
        
        // Populate the creator field before sending response
        const populatedList = await List.findById(savedList._id)
            .populate('creator', 'username')
            .populate('questions.question')
        
        res.status(201).json(populatedList)
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