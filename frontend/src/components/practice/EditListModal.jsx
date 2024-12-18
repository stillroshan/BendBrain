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
import QuestionTable from '../practice/QuestionTable'

const EditListModal = ({ isOpen, onClose, list, onSuccess }) => {
    const { token } = useContext(AuthContext)
    const [formData, setFormData] = useState({
        title: '',
        visibility: 'private',
        questions: []
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [availableQuestions, setAvailableQuestions] = useState([])
    const [selectedQuestions, setSelectedQuestions] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [filters, setFilters] = useState({
        section: '',
        difficulty: '',
        type: '',
        search: ''
    })

    // Fetch available questions
    const fetchQuestions = async (page, filters) => {
        try {
            const { data } = await axios.get('/api/questions', {
                params: {
                    ...filters,
                    page,
                    limit: 10
                }
            })
            setAvailableQuestions(data.questions)
            setTotalPages(data.totalPages)
        } catch (error) {
            console.error('Error fetching questions:', error)
        }
    }

    useEffect(() => {
        if (list) {
            setFormData({
                title: list.title,
                visibility: list.visibility,
                questions: list.questions.map(q => q.question.questionNumber)
            })
            // Set selected questions
            const selectedQs = list.questions.map(q => ({
                ...q.question,
                orderNumber: q.orderNumber
            }))
            setSelectedQuestions(selectedQs)
        }
        fetchQuestions(1, filters)
    }, [list])

    const handleAddQuestion = (question) => {
        if (!selectedQuestions.find(q => q.questionNumber === question.questionNumber)) {
            setSelectedQuestions([...selectedQuestions, {
                ...question,
                orderNumber: selectedQuestions.length + 1
            }])
            setFormData(prev => ({
                ...prev,
                questions: [...prev.questions, question.questionNumber]
            }))
        }
    }

    const handleRemoveQuestion = (questionNumber) => {
        setSelectedQuestions(selectedQuestions.filter(q => q.questionNumber !== questionNumber))
        setFormData(prev => ({
            ...prev,
            questions: prev.questions.filter(q => q !== questionNumber)
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await axios.put(`/api/lists/${list._id}`, {
                ...formData,
                questions: selectedQuestions.map(q => q.questionNumber)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            onSuccess()
        } catch (error) {
            setError(error.response?.data?.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
            <div className="modal-box w-11/12 max-w-5xl">
                <h3 className="font-bold text-lg mb-4">Edit List</h3>
                
                <form onSubmit={handleSubmit}>
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

                    <div className="space-y-6">
                        {/* Selected Questions */}
                        <div>
                            <h4 className="font-bold mb-2">Selected Questions</h4>
                            <QuestionTable 
                                questions={selectedQuestions}
                                totalPages={1}
                                onPageChange={() => {}}
                                onFilterChange={() => {}}
                                showFilters={false}
                                showStats={false}
                                showSection={true}
                                customAction={(question) => (
                                    <button 
                                        className="btn btn-error btn-sm"
                                        onClick={() => handleRemoveQuestion(question.questionNumber)}
                                    >
                                        Remove
                                    </button>
                                )}
                            />
                        </div>

                        {/* Available Questions */}
                        <div>
                            <h4 className="font-bold mb-2">Available Questions</h4>
                            <QuestionTable 
                                questions={availableQuestions}
                                totalPages={totalPages}
                                onPageChange={(page) => {
                                    setCurrentPage(page)
                                    fetchQuestions(page, filters)
                                }}
                                onFilterChange={(newFilters) => {
                                    setFilters(newFilters)
                                    fetchQuestions(1, newFilters)
                                }}
                                showFilters={true}
                                showStats={false}
                                showSection={true}
                                showStatus={true}
                                customAction={(question) => (
                                    <button 
                                        className="btn btn-primary btn-sm"
                                        onClick={() => handleAddQuestion(question)}
                                    >
                                        Add
                                    </button>
                                )}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="alert alert-error mt-4">
                            {error}
                        </div>
                    )}

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
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
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