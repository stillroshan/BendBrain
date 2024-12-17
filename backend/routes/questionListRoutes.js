import express from 'express'
import { 
    createList, 
    getLists, 
    getListById, 
    updateList, 
    deleteList, 
    toggleSaveList 
} from '../controllers/questionListController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public routes
router.get('/', getLists)
router.get('/:id', getListById)

// Protected routes
router.post('/', protect, createList)
router.put('/:id', protect, updateList)
router.delete('/:id', protect, deleteList)
router.post('/:id/save', protect, toggleSaveList)

export default router 