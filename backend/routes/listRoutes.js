import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import {
    createList,
    getLists,
    getListById,
    updateList,
    deleteList,
    toggleSaveList,
    forkList
} from '../controllers/listController.js'

const router = express.Router()

// Protected routes
router.use(protect) // All list routes require authentication

router.route('/')
    .get(getLists)
    .post(createList)

router.route('/:id')
    .get(getListById)
    .put(updateList)
    .delete(deleteList)

router.post('/:id/save', toggleSaveList)
router.post('/:id/fork', forkList)

export default router 