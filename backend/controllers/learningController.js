import Course from '../models/Course.js'
import Subject from '../models/Subject.js'
import Topic from '../models/Topic.js'

// Get all courses
export const getCourses = async (req, res) => {
    try {
        let query = {}
        
        // If not admin, only show published courses
        if (!req.user?.isAdmin) {
            query.isPublished = true
        }
        
        const courses = await Course.find(query)
        res.json(courses)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get course by ID
export const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate({
                path: 'subjects',
                populate: {
                    path: 'topics',
                    select: 'title order'
                }
            })
        if (!course) {
            return res.status(404).json({ message: 'Course not found' })
        }
        res.json(course)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get all subjects
export const getSubjects = async (req, res) => {
    try {
        let query = {}
        
        // If not admin, only show published subjects
        if (!req.user?.isAdmin) {
            query.isPublished = true
        }
        
        const subjects = await Subject.find(query)
        res.json(subjects)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get subject by ID
export const getSubjectById = async (req, res) => {
    try {
        let query = { _id: req.params.id }
        let topicsQuery = {};

        // If not admin, only show published items
        if (!req.user?.isAdmin) {
            topicsQuery.isPublished = true
        }

        const subject = await Subject.findById(query)
            .populate({
                path: 'topics',
                match: topicsQuery,
                select: 'title content headings order isPublished',
                options: { sort: { order: 1 } }
            });

        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        res.json(subject)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get topic content
export const getTopicContent = async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.id)
        if (!topic) {
            return res.status(404).json({ message: 'Topic not found' })
        }
        res.json(topic)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Admin: Create course
export const createCourse = async (req, res) => {
    try {
        const course = new Course({
            ...req.body,
            createdBy: req.user._id
        })
        const savedCourse = await course.save()
        res.status(201).json(savedCourse)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Admin: Update course
export const updateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
        if (!course) {
            return res.status(404).json({ message: 'Course not found' })
        }

        Object.assign(course, req.body)
        const updatedCourse = await course.save()
        res.json(updatedCourse)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Admin: Delete course
export const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
        if (!course) {
            return res.status(404).json({ message: 'Course not found' })
        }

        await Course.deleteOne({ _id: req.params.id })
        res.json({ message: 'Course deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Admin: Create subject
export const createSubject = async (req, res) => {
    try {
        const subject = new Subject({
            ...req.body,
            createdBy: req.user._id
        })
        const savedSubject = await subject.save()
        res.status(201).json(savedSubject)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Admin: Update subject
export const updateSubject = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id)
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' })
        }

        Object.assign(subject, req.body)
        const updatedSubject = await subject.save()
        res.json(updatedSubject)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Admin: Delete subject
export const deleteSubject = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id)
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' })
        }

        await Subject.deleteOne({ _id: req.params.id })
        res.json({ message: 'Subject deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Admin: Create topic
export const createTopic = async (req, res) => {
    try {
        const topic = new Topic({
            ...req.body,
            createdBy: req.user._id
        })
        const savedTopic = await topic.save()

        // Update the parent subject's topics array
        await Subject.findByIdAndUpdate(
            req.body.subject,
            { $push: { topics: savedTopic._id } }
        )

        res.status(201).json(savedTopic)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Admin: Update topic
export const updateTopic = async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.id)
        if (!topic) {
            return res.status(404).json({ message: 'Topic not found' })
        }

        Object.assign(topic, req.body)
        const updatedTopic = await topic.save()
        res.json(updatedTopic)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Admin: Delete topic
export const deleteTopic = async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.id)
        if (!topic) {
            return res.status(404).json({ message: 'Topic not found' })
        }

        await topic.deleteOne()
        res.json({ message: 'Topic deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Admin: Toggle publish status for course
export const togglePublishCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
        if (!course) {
            return res.status(404).json({ message: 'Course not found' })
        }

        course.isPublished = !course.isPublished
        const updatedCourse = await course.save()
        res.json(updatedCourse)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Admin: Toggle publish status for subject
export const togglePublishSubject = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id)
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' })
        }

        subject.isPublished = !subject.isPublished
        const updatedSubject = await subject.save()
        res.json(updatedSubject)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Admin: Toggle publish status for topic
export const togglePublishTopic = async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.id)
        if (!topic) {
            return res.status(404).json({ message: 'Topic not found' })
        }

        topic.isPublished = !topic.isPublished
        const updatedTopic = await topic.save()
        res.json(updatedTopic)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Admin: Reorder topics within a subject
export const reorderTopics = async (req, res) => {
    try {
        const { topicOrders } = req.body // Array of { id, order }
        
        // Update each topic's order
        await Promise.all(
            topicOrders.map(({ id, order }) => 
                Topic.findByIdAndUpdate(id, { order })
            )
        )

        res.json({ message: 'Topics reordered successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get topics
export const getTopics = async (req, res) => {
    try {
        let topics;
        
        // For admin routes, get all topics for a subject
        if (req.user?.isAdmin) {
            topics = await Topic.find({ subject: req.params.subjectId })
                .select('title content headings order isPublished')
                .sort('order')
        } else {
            // For public routes, only get published topics
            topics = await Topic.find({ 
                subject: req.params.subjectId,
                isPublished: true 
            })
            .select('title content headings order')
            .sort('order')
        }
        
        res.json(topics)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
} 