import PropTypes from 'prop-types'
import { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import { 
    XMarkIcon, 
    PlusIcon, 
    TrashIcon,
    ArrowsUpDownIcon 
} from '@heroicons/react/24/outline'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const EditListModal = ({ isOpen, onClose, list, onSuccess }) => {
    const { token } = useContext(AuthContext)
    const [formData, setFormData] = useState({
        title: '',
        visibility: 'private',
        questions: []
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [searching, setSearching] = useState(false)

    useEffect(() => {
        if (list) {
            setFormData({
                title: list.title,
                visibility: list.visibility,
                questions: list.questions.map(q => q.question.questionNumber)
            })
        }
    }, [list])

    // Debounced search function
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (searchTerm) {
                setSearching(true)
                try {
                    const { data } = await axios.get(`/api/questions/search?q=${searchTerm}`)
                    setSearchResults(data.questions)
                } catch (error) {
                    console.error('Error searching questions:', error)
                }
                setSearching(false)
            } else {
                setSearchResults([])
            }
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [searchTerm])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await axios.put(`/api/lists/${list._id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            onSuccess()
        } catch (error) {
            setError(error.response?.data?.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    const handleAddQuestion = (questionNumber) => {
        if (!formData.questions.includes(questionNumber)) {
            setFormData(prev => ({
                ...prev,
                questions: [...prev.questions, questionNumber]
            }))
        }
        setSearchTerm('')
        setSearchResults([])
    }

    const handleRemoveQuestion = (index) => {
        setFormData(prev => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== index)
        }))
    }

    const handleDragEnd = (result) => {
        if (!result.destination) return

        const questions = Array.from(formData.questions)
        const [reorderedItem] = questions.splice(result.source.index, 1)
        questions.splice(result.destination.index, 0, reorderedItem)

        setFormData(prev => ({
            ...prev,
            questions
        }))
    }

    if (!isOpen) return null

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-3xl">
                <button 
                    className="btn btn-sm btn-circle absolute right-2 top-2"
                    onClick={onClose}
                >
                    <XMarkIcon className="w-5 h-5" />
                </button>
                
                <h3 className="font-bold text-lg mb-4">Edit List</h3>
                
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="alert alert-error mb-4">
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text">Title</span>
                        </label>
                        <input 
                            type="text"
                            className="input input-bordered"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                title: e.target.value
                            }))}
                            required
                        />
                    </div>

                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text">Visibility</span>
                        </label>
                        <select 
                            className="select select-bordered"
                            value={formData.visibility}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                visibility: e.target.value
                            }))}
                        >
                            <option value="private">Private</option>
                            <option value="public">Public</option>
                        </select>
                    </div>

                    {/* Question Search */}
                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text">Add Questions</span>
                        </label>
                        <div className="relative">
                            <input 
                                type="text"
                                className="input input-bordered w-full"
                                placeholder="Search questions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searching && (
                                <div className="absolute right-3 top-3">
                                    <span className="loading loading-spinner loading-sm"></span>
                                </div>
                            )}
                            {searchResults.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-base-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                                    {searchResults.map(question => (
                                        <button
                                            key={question.questionNumber}
                                            type="button"
                                            className="w-full p-2 hover:bg-base-300 flex items-center justify-between"
                                            onClick={() => handleAddQuestion(question.questionNumber)}
                                        >
                                            <span>{question.title}</span>
                                            <PlusIcon className="w-5 h-5" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Questions List */}
                    <div className="mb-6">
                        <label className="label">
                            <span className="label-text">Questions</span>
                            <span className="label-text-alt">Drag to reorder</span>
                        </label>
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="questions">
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="space-y-2"
                                    >
                                        {formData.questions.map((questionNumber, index) => (
                                            <Draggable
                                                key={questionNumber}
                                                draggableId={questionNumber.toString()}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className="flex items-center gap-2 p-2 bg-base-200 rounded-lg"
                                                    >
                                                        <div {...provided.dragHandleProps}>
                                                            <ArrowsUpDownIcon className="w-5 h-5 text-base-content/70" />
                                                        </div>
                                                        <span className="flex-1">
                                                            Question {questionNumber}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            className="btn btn-ghost btn-sm"
                                                            onClick={() => handleRemoveQuestion(index)}
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>

                    <div className="modal-action">
                        <button 
                            type="button" 
                            className="btn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="loading loading-spinner"></span>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

EditListModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    list: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        visibility: PropTypes.string.isRequired,
        questions: PropTypes.arrayOf(PropTypes.shape({
            question: PropTypes.shape({
                questionNumber: PropTypes.string.isRequired
            }).isRequired
        })).isRequired
    }),
    onSuccess: PropTypes.func.isRequired
}

export default EditListModal