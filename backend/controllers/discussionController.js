import Discussion from '../models/Discussion.js'
import User from '../models/User.js'
import Notification from '../models/Notification.js'

// Get all discussions with filters
const getDiscussions = async (req, res) => {
    try {
        const { category, sort, search } = req.query
        let query = {}
        
        // Apply category filter
        if (category && category !== 'All') {
            query.category = category
        }

        // Apply search filter
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ]
        }

        // Build sort options
        let sortOption = {}
        switch (sort) {
            case 'popular':
                sortOption = { 'likes.length': -1 }
                break
            case 'views':
                sortOption = { views: -1 }
                break
            default:
                sortOption = { createdAt: -1 }
        }

        const discussions = await Discussion.find(query)
            .sort(sortOption)
            .populate('userId', 'username profilePicture')
            .lean()

        res.json(discussions)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get discussions for a specific question
const getQuestionDiscussions = async (req, res) => {
    try {
        const { questionId } = req.params
        const discussions = await Discussion.find({ questionId })
            .populate('userId', 'username profilePicture')
            .populate('replies.userId', 'username profilePicture')
            .sort({ isPinned: -1, createdAt: -1 })
            .lean()

        res.json(discussions)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Create new discussion
const createDiscussion = async (req, res) => {
    try {
        const { title, content, category, questionId, tags } = req.body
        const userId = req.user._id

        const discussion = new Discussion({
            title,
            content,
            userId,
            category,
            questionId,
            tags
        })

        await discussion.save()
        
        const populatedDiscussion = await Discussion.findById(discussion._id)
            .populate('userId', 'username profilePicture')
            .lean()

        res.status(201).json(populatedDiscussion)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Add reply to discussion
const addReply = async (req, res) => {
    try {
        const { discussionId } = req.params
        const { content } = req.body
        const userId = req.user._id

        const discussion = await Discussion.findById(discussionId)
        if (!discussion) {
            return res.status(404).json({ message: 'Discussion not found' })
        }

        discussion.replies.push({
            userId,
            content
        })

        const updatedDiscussion = await discussion.save()
        await updatedDiscussion
            .populate('replies.userId', 'username profilePicture')
            .execPopulate()

        res.json(updatedDiscussion)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Toggle like on discussion
const toggleLike = async (req, res) => {
    try {
        const { discussionId } = req.params
        const userId = req.user._id

        const discussion = await Discussion.findById(discussionId)
        if (!discussion) {
            return res.status(404).json({ message: 'Discussion not found' })
        }

        const likeIndex = discussion.likes.indexOf(userId)
        const dislikeIndex = discussion.dislikes.indexOf(userId)

        // Remove from dislikes if exists
        if (dislikeIndex > -1) {
            discussion.dislikes.splice(dislikeIndex, 1)
        }

        // Toggle like
        if (likeIndex > -1) {
            discussion.likes.splice(likeIndex, 1)
        } else {
            discussion.likes.push(userId)
        }

        await discussion.save()
        res.json(discussion)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Toggle dislike on discussion
const toggleDislike = async (req, res) => {
    try {
        const { discussionId } = req.params
        const userId = req.user._id

        const discussion = await Discussion.findById(discussionId)
        if (!discussion) {
            return res.status(404).json({ message: 'Discussion not found' })
        }

        const dislikeIndex = discussion.dislikes.indexOf(userId)
        const likeIndex = discussion.likes.indexOf(userId)

        // Remove from likes if exists
        if (likeIndex > -1) {
            discussion.likes.splice(likeIndex, 1)
        }

        // Toggle dislike
        if (dislikeIndex > -1) {
            discussion.dislikes.splice(dislikeIndex, 1)
        } else {
            discussion.dislikes.push(userId)
        }

        await discussion.save()
        res.json(discussion)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Toggle pin status (admin only)
const togglePin = async (req, res) => {
    try {
        const { discussionId } = req.params
        
        const discussion = await Discussion.findById(discussionId)
        if (!discussion) {
            return res.status(404).json({ message: 'Discussion not found' })
        }

        discussion.isPinned = !discussion.isPinned
        await discussion.save()
        
        res.json(discussion)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Increment view count
const incrementViews = async (req, res) => {
    try {
        const { discussionId } = req.params
        
        const discussion = await Discussion.findByIdAndUpdate(
            discussionId,
            { $inc: { views: 1 } },
            { new: true }
        )

        if (!discussion) {
            return res.status(404).json({ message: 'Discussion not found' })
        }

        res.json(discussion)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Get discussion by ID
const getDiscussionById = async (req, res) => {
    try {
        const discussion = await Discussion.findById(req.params.id)
            .populate('userId', 'username profilePicture')
            .populate('replies.userId', 'username profilePicture')
            
        if (!discussion) {
            return res.status(404).json({ message: 'Discussion not found' })
        }

        res.json(discussion)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export {
    getDiscussions,
    getQuestionDiscussions,
    createDiscussion,
    addReply,
    toggleLike,
    toggleDislike,
    togglePin,
    incrementViews,
    getDiscussionById
} 