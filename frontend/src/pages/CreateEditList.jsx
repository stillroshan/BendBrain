import { useState, useEffect, useCallback, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
    PlusIcon,
    XMarkIcon,
    TagIcon,
    MagnifyingGlassIcon,
    CheckIcon
} from '@heroicons/react/24/outline'
import { AuthContext } from '../context/AuthContext'

const CreateEditList = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { token } = useContext(AuthContext)
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [newTag, setNewTag] = useState('')
    const [list, setList] = useState({
        title: '',
        description: '',
        questions: [],
        category: 'Custom',
        difficulty: 'Mixed',
        visibility: 'Public',
        tags: []
    })
    const [searchFilters, setSearchFilters] = useState({
        section: '',
        difficulty: '',
        type: ''
    });
    const [availableQuestions, setAvailableQuestions] = useState([]);
    const [questionsPagination, setQuestionsPagination] = useState({
        page: 1,
        limit: 10,
        total: 0
    });
    const [selectedQuestions, setSelectedQuestions] = useState({});

    const fetchList = useCallback(async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(`/api/lists/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setList({
                ...data,
                questions: data.questions.map(q => q.questionId._id)
            })
            if (data.questions) {
                const questionsData = {};
                data.questions.forEach(q => {
                    questionsData[q.questionId._id] = q.questionId;
                });
                setSelectedQuestions(questionsData);
            }
        } catch (error) {
            console.error('Error fetching list:', error)
        } finally {
            setLoading(false)
        }
    }, [id, token])

    useEffect(() => {
        if (id) {
            fetchList()
        }
    }, [id, fetchList])

    const addQuestion = (question) => {
        setList(prev => ({
            ...prev,
            questions: [...prev.questions, question._id]
        }));
        setSelectedQuestions(prev => ({
            ...prev,
            [question._id]: question
        }));
    }

    const removeQuestion = (questionId) => {
        setList(prev => ({
            ...prev,
            questions: prev.questions.filter(id => id !== questionId)
        }));
        setSelectedQuestions(prev => {
            const newSelected = { ...prev };
            delete newSelected[questionId];
            return newSelected;
        });
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            
            if (id) {
                await axios.put(`/api/lists/${id}`, list, config)
            } else {
                await axios.post('/api/lists', list, config)
            }
            navigate('/lists')
        } catch (error) {
            console.error('Error saving list:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchAvailableQuestions = useCallback(async () => {
        try {
            const { data } = await axios.get('/api/questions', {
                params: {
                    search: searchQuery,
                    ...searchFilters,
                    page: questionsPagination.page,
                    limit: questionsPagination.limit
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            setAvailableQuestions(data.questions || []);
            setQuestionsPagination(prev => ({
                ...prev,
                total: data.pagination?.total || 0
            }));
        } catch (error) {
            console.error('Error fetching questions:', error);
            setAvailableQuestions([]);
            setQuestionsPagination(prev => ({
                ...prev,
                total: 0
            }));
        }
    }, [searchQuery, searchFilters, questionsPagination.page, questionsPagination.limit, token]);

    useEffect(() => {
        fetchAvailableQuestions();
    }, [fetchAvailableQuestions]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-16 max-w-4xl">
            {/* Header Section */}
            <div className="bg-base-200 rounded-box p-8 mb-8">
                <h1 className="text-3xl font-bold mb-4">
                    {id ? 'Edit Question List' : 'Create New Question List'}
                </h1>
                <p className="text-base-content/70">
                    {id ? 'Update your question list details and content.' : 'Create a new list to organize questions and share with others.'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 gap-8">
                    {/* Basic Information Card */}
                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                            <h2 className="card-title mb-4">Basic Information</h2>
                            
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Title</span>
                                </label>
                                <input
                                    type="text"
                                    value={list.title}
                                    onChange={(e) => setList(prev => ({ ...prev, title: e.target.value }))}
                                    className="input input-bordered w-full"
                                    placeholder="Enter a descriptive title"
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Description</span>
                                </label>
                                <textarea
                                    value={list.description}
                                    onChange={(e) => setList(prev => ({ ...prev, description: e.target.value }))}
                                    className="textarea textarea-bordered h-32"
                                    placeholder="Describe what this list is about"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Settings Card */}
                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                            <h2 className="card-title mb-4">List Settings</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Category</span>
                                    </label>
                                    <select
                                        value={list.category}
                                        onChange={(e) => setList(prev => ({ ...prev, category: e.target.value }))}
                                        className="select select-bordered w-full"
                                    >
                                        <option value="Interview Prep">Interview Prep</option>
                                        <option value="Topic Wise">Topic Wise</option>
                                        <option value="Company Specific">Company Specific</option>
                                        <option value="Custom">Custom</option>
                                    </select>
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Difficulty</span>
                                    </label>
                                    <select
                                        value={list.difficulty}
                                        onChange={(e) => setList(prev => ({ ...prev, difficulty: e.target.value }))}
                                        className="select select-bordered w-full"
                                    >
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                        <option value="Mixed">Mixed</option>
                                    </select>
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Visibility</span>
                                    </label>
                                    <select
                                        value={list.visibility}
                                        onChange={(e) => setList(prev => ({ ...prev, visibility: e.target.value }))}
                                        className="select select-bordered w-full"
                                    >
                                        <option value="Public">Public</option>
                                        <option value="Private">Private</option>
                                        <option value="Unlisted">Unlisted</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tags Card */}
                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                            <h2 className="card-title mb-4">Tags</h2>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                                {list.tags.map(tag => (
                                    <div key={tag} className="badge badge-lg gap-2">
                                        <TagIcon className="w-4 h-4" />
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="btn btn-ghost btn-xs btn-circle"
                                        >
                                            <XMarkIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="input-group">
                                <div className="flex w-full">
                                    <input
                                        type="text"
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        className="input input-bordered w-full"
                                        placeholder="Add a tag"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addTag(e);
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={addTag}
                                        className="btn btn-primary flex items-center gap-2"
                                    >
                                        <PlusIcon className="w-5 h-5" />
                                        <span>Add Tag</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Questions Card */}
                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                            <h2 className="card-title mb-4">Questions</h2>
                            
                            {/* Search and Filters */}
                            <div className="bg-base-200 rounded-lg p-4 mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="input input-bordered w-full pr-10"
                                            placeholder="Search questions..."
                                        />
                                        <button 
                                            type="button" 
                                            onClick={fetchAvailableQuestions}
                                            className="absolute right-2 top-1/2 -translate-y-1/2"
                                        >
                                            <MagnifyingGlassIcon className="w-5 h-5 text-base-content/50" />
                                        </button>
                                    </div>

                                    <select
                                        className="select select-bordered w-full"
                                        onChange={(e) => {
                                            setSearchFilters(prev => ({ ...prev, section: e.target.value }));
                                            setQuestionsPagination(prev => ({ ...prev, page: 1 }));
                                        }}
                                    >
                                        <option value="">All Sections</option>
                                        <option value="Numerical Ability">Numerical Ability</option>
                                        <option value="Verbal Reasoning">Verbal Reasoning</option>
                                        <option value="Non-verbal Reasoning">Non-verbal Reasoning</option>
                                        <option value="Verbal Ability">Verbal Ability</option>
                                        <option value="Quantitative Aptitude">Quantitative Aptitude</option>
                                        <option value="Data Interpretation">Data Interpretation</option>
                                    </select>

                                    <select
                                        className="select select-bordered w-full"
                                        onChange={(e) => {
                                            setSearchFilters(prev => ({ ...prev, difficulty: e.target.value }));
                                            setQuestionsPagination(prev => ({ ...prev, page: 1 }));
                                        }}
                                    >
                                        <option value="">All Difficulties</option>
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>

                                    <select
                                        className="select select-bordered w-full"
                                        onChange={(e) => {
                                            setSearchFilters(prev => ({ ...prev, type: e.target.value }));
                                            setQuestionsPagination(prev => ({ ...prev, page: 1 }));
                                        }}
                                    >
                                        <option value="">All Types</option>
                                        <option value="MCQ">MCQ</option>
                                        <option value="Integer">Integer</option>
                                    </select>
                                </div>
                            </div>

                            {/* Available Questions Table */}
                            <div className="bg-base-100 rounded-lg mb-8">
                                <div className="overflow-x-auto">
                                    <table className="table table-zebra w-full">
                                        <thead>
                                            <tr className="bg-base-200">
                                                <th className="font-bold">Number</th>
                                                <th className="font-bold">Title</th>
                                                <th className="font-bold">Section</th>
                                                <th className="font-bold">Difficulty</th>
                                                <th className="font-bold">Type</th>
                                                <th className="font-bold">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {availableQuestions.map((question) => (
                                                <tr 
                                                    key={question._id}
                                                    className="hover:bg-base-200 transition-colors duration-200"
                                                >
                                                    <td className="font-medium">{question.questionNumber}</td>
                                                    <td>{question.title}</td>
                                                    <td>{question.section}</td>
                                                    <td>
                                                        <span className={`font-medium ${
                                                            question.difficulty === 'Hard' ? 'text-error' :
                                                            question.difficulty === 'Medium' ? 'text-warning' :
                                                            'text-success'
                                                        }`}>
                                                            {question.difficulty}
                                                        </span>
                                                    </td>
                                                    <td>{question.type}</td>
                                                    <td>
                                                        <button
                                                            type="button"
                                                            onClick={() => addQuestion(question)}
                                                            className="btn btn-ghost btn-sm"
                                                            disabled={list.questions.includes(question._id)}
                                                        >
                                                            {list.questions.includes(question._id) ? (
                                                                <CheckIcon className="w-4 h-4 text-success" />
                                                            ) : (
                                                                <PlusIcon className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination for Available Questions */}
                                <div className="flex justify-center mt-4 mb-8">
                                    <div className="join">
                                        <button
                                            className="join-item btn"
                                            onClick={() => setQuestionsPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                            disabled={questionsPagination.page <= 1}
                                        >
                                            «
                                        </button>
                                        {Array.from({ 
                                            length: Math.max(Math.ceil(questionsPagination.total / questionsPagination.limit), 1) 
                                        }).map((_, idx) => {
                                            const pageNum = idx + 1;
                                            const totalPages = Math.max(Math.ceil(questionsPagination.total / questionsPagination.limit), 1);
                                            
                                            if (
                                                pageNum === 1 ||
                                                pageNum === totalPages ||
                                                (pageNum >= questionsPagination.page - 2 && pageNum <= questionsPagination.page + 2)
                                            ) {
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        className={`join-item btn ${pageNum === questionsPagination.page ? 'btn-active' : ''}`}
                                                        onClick={() => setQuestionsPagination(prev => ({ ...prev, page: pageNum }))}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            }
                                            if (pageNum === questionsPagination.page - 3 || pageNum === questionsPagination.page + 3) {
                                                return <button key={pageNum} className="join-item btn btn-disabled">...</button>;
                                            }
                                            return null;
                                        })}
                                        <button
                                            className="join-item btn"
                                            onClick={() => setQuestionsPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                            disabled={questionsPagination.page >= Math.ceil(questionsPagination.total / questionsPagination.limit)}
                                        >
                                            »
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Selected Questions */}
                            <div className="divider">Selected Questions</div>
                            <div className="bg-base-100 rounded-lg">
                                <div className="overflow-x-auto">
                                    <table className="table table-zebra w-full">
                                        <thead>
                                            <tr className="bg-base-200">
                                                <th className="font-bold">Order</th>
                                                <th className="font-bold">Number</th>
                                                <th className="font-bold">Title</th>
                                                <th className="font-bold">Section</th>
                                                <th className="font-bold">Difficulty</th>
                                                <th className="font-bold">Type</th>
                                                <th className="font-bold">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {list.questions.map((questionId, index) => {
                                                const question = selectedQuestions[questionId] || availableQuestions.find(q => q._id === questionId);
                                                if (!question) return null; // Skip if question data is not available
                                                
                                                return (
                                                    <tr 
                                                        key={questionId}
                                                        className="hover:bg-base-200 transition-colors duration-200"
                                                    >
                                                        <td className="font-medium">{index + 1}</td>
                                                        <td className="font-medium">{question.questionNumber}</td>
                                                        <td>{question?.title}</td>
                                                        <td>{question?.section}</td>
                                                        <td>
                                                            <span className={`font-medium ${
                                                                question.difficulty === 'Hard' ? 'text-error' :
                                                                question.difficulty === 'Medium' ? 'text-warning' :
                                                                'text-success'
                                                            }`}>
                                                                {question.difficulty}
                                                            </span>
                                                        </td>
                                                        <td>{question?.type}</td>
                                                        <td>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeQuestion(questionId)}
                                                                className="btn btn-ghost btn-sm"
                                                            >
                                                                <XMarkIcon className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mt-8">
                    <button
                        type="button"
                        onClick={() => navigate('/lists')}
                        className="btn btn-ghost"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={`btn btn-primary ${loading ? 'loading' : ''}`}
                        disabled={loading || !list.title || !list.description || list.questions.length === 0}
                    >
                        {id ? 'Update List' : 'Create List'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateEditList 