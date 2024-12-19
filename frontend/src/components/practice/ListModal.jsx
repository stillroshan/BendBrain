import { useState, useEffect, useContext } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'
import ListQuestionTable from './ListQuestionTable'
import PropTypes from 'prop-types'

const ListModal = ({ list = null, onClose, onSubmit }) => {
    const { token } = useContext(AuthContext)
    const [title, setTitle] = useState(list?.title || '')
    const [visibility, setVisibility] = useState(list?.visibility || 'private')
    const [selectedQuestions, setSelectedQuestions] = useState(
        list?.questions.map((q, index) => ({
            ...q.question,
            order: q.order
        })) || []
    )
    const [availableQuestions, setAvailableQuestions] = useState([])
    const [filters, setFilters] = useState({
        section: '',
        difficulty: '',
        type: '',
        search: ''
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get('/api/questions', {
                    params: {
                        ...filters,
                        page: currentPage,
                        limit: 50
                    }
                })
                setAvailableQuestions(response.data.questions)
                setTotalPages(response.data.totalPages)
            } catch (error) {
                console.error('Error fetching questions:', error)
            }
        }
        fetchQuestions()
    }, [currentPage, filters])

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit({
            title,
            visibility,
            questions: selectedQuestions.map((q, index) => ({
                question: q._id,
                order: q.order
            }))
        })
    }

    const handleAddQuestion = (question) => {
        setSelectedQuestions([...selectedQuestions, {
            ...question,
            order: selectedQuestions.length + 1
        }])
    }

    const handleRemoveQuestion = (question) => {
        const newSelectedQuestions = selectedQuestions
            .filter(q => q._id !== question._id)
            .map((q, index) => ({ ...q, order: index + 1 }))
        setSelectedQuestions(newSelectedQuestions)
    }

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-4xl mt-16">
                <button 
                    className="btn btn-sm btn-circle absolute right-2 top-2"
                    onClick={onClose}
                >
                    <XMarkIcon className="h-5 w-5" />
                </button>

                <h3 className="font-bold text-lg mb-4">
                    {list ? 'Edit List' : 'Create New List'}
                </h3>

                <div className="grid grid-cols-1 gap-6">
                    {/* List Details Section */}
                    <div>
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">Title</span>
                            </label>
                            <input 
                                type="text"
                                className="input input-bordered"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                disabled={list?.isFavorites}
                            />
                        </div>

                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">Visibility</span>
                            </label>
                            <select 
                                className="select select-bordered"
                                value={visibility}
                                onChange={(e) => setVisibility(e.target.value)}
                                disabled={list?.isFavorites}
                            >
                                <option value="private">Private</option>
                                <option value="public">Public</option>
                            </select>
                        </div>
                    </div>

                    {/* Questions Section */}
                    <div>
                        {/* Selected Questions */}
                        <div className="mb-6">
                            <h4 className="font-bold mb-2">Selected Questions</h4>
                            {selectedQuestions.length > 0 ? (
                                <ListQuestionTable 
                                    questions={selectedQuestions}
                                    totalPages={1}
                                    onPageChange={() => {}}
                                    onFilterChange={() => {}}
                                    showFilters={false}
                                    showSection={true}
                                    onRemove={handleRemoveQuestion}
                                    showOrder={true}
                                    showActions={true}
                                />
                            ) : (
                                <p className="text-base-content/70">No questions selected</p>
                            )}
                        </div>

                        {/* Available Questions */}
                        <div>
                            <h4 className="font-bold mb-2">Available Questions</h4>
                            <ListQuestionTable 
                                questions={availableQuestions}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                onFilterChange={setFilters}
                                showFilters={true}
                                showSection={true}
                                onAdd={handleAddQuestion}
                                showOrder={false}
                                showActions={true}
                            />
                        </div>
                    </div>

                    <div className="modal-action">
                        <button type="button" className="btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button 
                            className="btn btn-primary"
                            onClick={handleSubmit}
                            disabled={selectedQuestions.length === 0 || !title || list?.isFavorites}
                        >
                            {list ? 'Save Changes' : 'Create List'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

ListModal.propTypes = {
    list: PropTypes.shape({
        title: PropTypes.string.isRequired,
        visibility: PropTypes.string.isRequired,
        isFavorites: PropTypes.bool,
        questions: PropTypes.arrayOf(PropTypes.shape({
            question: PropTypes.shape({
                _id: PropTypes.string.isRequired,
                title: PropTypes.string.isRequired,
                questionNumber: PropTypes.number.isRequired,
                difficulty: PropTypes.string.isRequired,
                type: PropTypes.string.isRequired,
                section: PropTypes.string
            }).isRequired,
            order: PropTypes.number.isRequired
        })).isRequired
    }),
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
}

export default ListModal 