import express from 'express'
import { protect, admin } from '../middleware/authMiddleware.js'
import {
    getCourses,
    getSubjects,
    getTopicContent,
    createCourse,
    createSubject, 
    createTopic,
    updateCourse,
    updateSubject,
    updateTopic,
    deleteCourse,
    deleteSubject,
    deleteTopic,
    getCourseById,
    getSubjectById,
    togglePublishCourse,
    togglePublishSubject,
    togglePublishTopic,
    reorderTopics,
    getTopics
} from '../controllers/learningController.js'

const router = express.Router()

// Public routes
router.get('/courses', getCourses)
router.get('/subjects', getSubjects)
router.get('/courses/:id', getCourseById)
router.get('/subjects/:id', getSubjectById)
router.get('/topics/:id', getTopicContent)

// Admin routes - will return all items regardless of publish status
router.get('/admin/courses', protect, admin, getCourses)
router.get('/admin/subjects', protect, admin, getSubjects)

router.post('/courses', protect, admin, createCourse)
router.post('/subjects', protect, admin, createSubject)
router.post('/topics', protect, admin, createTopic)

router.put('/courses/:id', protect, admin, updateCourse)
router.put('/subjects/:id', protect, admin, updateSubject)
router.put('/topics/:id', protect, admin, updateTopic)

router.delete('/courses/:id', protect, admin, deleteCourse)
router.delete('/subjects/:id', protect, admin, deleteSubject)
router.delete('/topics/:id', protect, admin, deleteTopic)

router.put('/courses/:id/publish', protect, admin, togglePublishCourse)
router.put('/subjects/:id/publish', protect, admin, togglePublishSubject)
router.put('/topics/:id/publish', protect, admin, togglePublishTopic)

router.put('/subjects/:id/reorder', protect, admin, reorderTopics)

export default router 