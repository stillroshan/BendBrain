import PropTypes from 'prop-types'
import { useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import { 
    PencilIcon, 
    TrashIcon, 
    LockClosedIcon, 
    GlobeAltIcon,
    BookmarkIcon
} from '@heroicons/react/24/outline'
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid'
import EditListModal from './EditListModal'

const ListContent = ({ list, onUpdate, onDelete }) => {
    const { user, token } = useContext(AuthContext)
    const [showEditModal, setShowEditModal] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    if (!list) {
        return (
            <div className="flex justify-center items-center h-full text-base-content/70">
                Select a list to view its contents
            </div>
        )
    }

    const handleSave = async () => {
        try {
            setIsSaving(true)
            await axios.post(`/api/lists/${list._id}/save`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
            onUpdate(list._id)
        } catch (error) {
            console.error('Error saving list:', error)
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this list?')) {
            try {
                await axios.delete(`/api/lists/${list._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                onDelete()
            } catch (error) {
                console.error('Error deleting list:', error)
            }
        }
    }

    const isOwner = user && list.creator._id === user._id
    const isSaved = user && list.savedBy?.includes(user._id)

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold">{list.title}</h1>
                        {list.visibility === 'private' ? (
                            <LockClosedIcon className="w-5 h-5 text-base-content/70" />
                        ) : (
                            <GlobeAltIcon className="w-5 h-5 text-base-content/70" />
                        )}
                    </div>
                    <p className="text-base-content/70">
                        Created by {list.creator.username} • {list.questions.length} questions
                    </p>
                </div>

                <div className="flex gap-2">
                    {!list.isFavorites && user && (
                        <button 
                            className={`btn btn-outline ${isSaved ? 'btn-primary' : ''}`}
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaved ? (
                                <BookmarkSolidIcon className="w-5 h-5" />
                            ) : (
                                <BookmarkIcon className="w-5 h-5" />
                            )}
                            {isSaved ? 'Saved' : 'Save'}
                        </button>
                    )}
                    {isOwner && !list.isFavorites && (
                        <>
                            <button 
                                className="btn btn-ghost"
                                onClick={() => setShowEditModal(true)}
                            >
                                <PencilIcon className="w-5 h-5" />
                            </button>
                            <button 
                                className="btn btn-ghost text-error"
                                onClick={handleDelete}
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Questions Table */}
            <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Order</th>
                            <th>Question</th>
                            <th>Difficulty</th>
                            <th>Type</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.questions.map((item) => (
                            <tr 
                                key={item.question.questionNumber}
                                className="hover cursor-pointer"
                                onClick={() => window.location.href = `/question/${item.question.questionNumber}`}
                            >
                                <td>{item.orderNumber}</td>
                                <td>{item.question.title}</td>
                                <td>
                                    <span className={`badge ${
                                        item.question.difficulty === 'Easy' ? 'badge-success' :
                                        item.question.difficulty === 'Medium' ? 'badge-warning' :
                                        'badge-error'
                                    }`}>
                                        {item.question.difficulty}
                                    </span>
                                </td>
                                <td>{item.question.type}</td>
                                <td>
                                    <span className="badge badge-ghost">
                                        Not Attempted
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            <EditListModal 
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                list={list}
                onSuccess={() => {
                    setShowEditModal(false)
                    onUpdate(list._id)
                }}
            />
        </div>
    )
}

ListContent.propTypes = {
    list: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        visibility: PropTypes.string.isRequired,
        isFavorites: PropTypes.bool,
        creator: PropTypes.shape({
            _id: PropTypes.string.isRequired,
            username: PropTypes.string.isRequired
        }),
        questions: PropTypes.arrayOf(PropTypes.shape({
            orderNumber: PropTypes.number.isRequired,
            question: PropTypes.shape({
                questionNumber: PropTypes.string.isRequired,
                title: PropTypes.string.isRequired,
                difficulty: PropTypes.string.isRequired,
                type: PropTypes.string.isRequired
            })
        })),
        savedBy: PropTypes.arrayOf(PropTypes.string)
    }),
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
}

export default ListContent