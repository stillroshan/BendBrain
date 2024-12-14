import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline'
import { AuthContext } from '../context/AuthContext'

const CreateEditList = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [list, setList] = useState({
        title: '',
        description: '',
        questions: [],
        isPublic: true,
        tags: []
    })
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [newTag, setNewTag] = useState('')
    const { user, token } = useContext(AuthContext)

    // Fetch list data if editing
    useEffect(() => {
        if (id) {
            const fetchList = async () => {
                try {
                    const response = await axios.get(`/api/lists/${id}`)
                    setList(response.data)
                } catch (error) {
                    console.error('Error fetching list:', error)
                }
            }
            fetchList()
        }
    }, [id])

    // Search questions
    useEffect(() => {
        const searchQuestions = async () => {
            if (!searchQuery) {
                setSearchResults([])
                return
            }
            try {
                const response = await axios.get(`/api/questions?search=${searchQuery}`)
                setSearchResults(response.data.questions)
            } catch (error) {
                console.error('Error searching questions:', error)
            }
        }
        const timeoutId = setTimeout(searchQuestions, 300)
        return () => clearTimeout(timeoutId)
    }, [searchQuery])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!user) {
            alert('You must be logged in to create a list.')
            return
        }
        
        setLoading(true)
        try {
            if (id) {
                await axios.put(`/api/lists/${id}`, list, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            } else {
                await axios.post('/api/lists', list, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            }
            navigate('/lists')
        } catch (error) {
            console.error('Error saving list:', error)
            alert(error.response?.data?.message || 'Error saving list')
        } finally {
            setLoading(false)
        }
    }

    const addQuestion = (question) => {
        if (!list.questions.includes(question.questionNumber)) {
            setList(prev => ({
                ...prev,
                questions: [...prev.questions, question.questionNumber]
            }))
        }
        setSearchQuery('')
    }

    const removeQuestion = (questionNumber) => {
        setList(prev => ({
            ...prev,
            questions: prev.questions.filter(q => q !== questionNumber)
        }))
    }

    const addTag = (e) => {
        e.preventDefault()
        if (newTag && !list.tags.includes(newTag)) {
            setList(prev => ({
                ...prev,
                tags: [...prev.tags, newTag]
            }))
            setNewTag('')
        }
    }

    const removeTag = (tag) => {
        setList(prev => ({
            ...prev,
            tags: prev.tags.filter(t => t !== tag)
        }))
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-16 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">
                {id ? 'Edit Question List' : 'Create New Question List'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-semibold">Title</span>
                    </label>
                    <input
                        type="text"
                        value={list.title}
                        onChange={(e) => setList(prev => ({ ...prev, title: e.target.value }))}
                        className="input input-bordered w-full"
                        placeholder="Enter list title"
                        required
                    />
                </div>

                {/* Description */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-semibold">Description</span>
                    </label>
                    <textarea
                        value={list.description}
                        onChange={(e) => setList(prev => ({ ...prev, description: e.target.value }))}
                        className="textarea textarea-bordered h-24"
                        placeholder="Describe your question list"
                        required
                    />
                </div>

                {/* Visibility */}
                <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-4">
                        <input
                            type="checkbox"
                            checked={list.isPublic}
                            onChange={(e) => setList(prev => ({ ...prev, isPublic: e.target.checked }))}
                            className="checkbox"
                        />
                        <span className="label-text">Make this list public</span>
                    </label>
                </div>

                {/* Tags */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-semibold">Tags</span>
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {list.tags.map(tag => (
                            <div key={tag} className="badge badge-lg gap-2">
                                {tag}
                                <XMarkIcon 
                                    className="w-4 h-4 cursor-pointer" 
                                    onClick={() => removeTag(tag)}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            className="input input-bordered flex-1"
                            placeholder="Add a tag"
                        />
                        <button 
                            onClick={addTag}
                            className="btn btn-square btn-primary"
                        >
                            <PlusIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Questions Search */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-semibold">Add Questions</span>
                    </label>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input input-bordered w-full"
                        placeholder="Search questions by title or number"
                    />
                    {searchResults.length > 0 && (
                        <div className="mt-2 card bg-base-200 shadow-xl">
                            <div className="card-body p-2">
                                {searchResults.map(question => (
                                    <div 
                                        key={question._id}
                                        className="flex justify-between items-center p-2 hover:bg-base-300 rounded cursor-pointer"
                                        onClick={() => addQuestion(question)}
                                    >
                                        <div>
                                            <span className="font-semibold">#{question.questionNumber}</span>
                                            <span className="ml-2">{question.title}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="badge badge-outline">{question.difficulty}</span>
                                            <span className="badge badge-outline">{question.section}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Selected Questions */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-semibold">Selected Questions ({list.questions.length})</span>
                    </label>
                    <div className="card bg-base-200">
                        <div className="card-body">
                            {list.questions.map((questionNumber) => (
                                <div key={questionNumber} className="flex justify-between items-center">
                                    <span>#{questionNumber}</span>
                                    <button 
                                        type="button"
                                        onClick={() => removeQuestion(questionNumber)}
                                        className="btn btn-ghost btn-sm"
                                    >
                                        <XMarkIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4">
                    <button 
                        type="button" 
                        onClick={() => navigate('/lists')}
                        className="btn btn-ghost"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : (id ? 'Save Changes' : 'Create List')}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateEditList 