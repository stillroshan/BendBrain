import { useState, useEffect, useContext } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import {
    UserIcon,
    CalendarIcon,
    BookmarkIcon,
    ShareIcon,
    PencilSquareIcon,
    TrashIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline'

const QuestionListDetail = () => {
    const { id } = useParams()
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()
    const [list, setList] = useState(null)
    const [questions, setQuestions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchListDetails = async () => {
            try {
                const response = await axios.get(`/api/lists/${id}`)
                setList(response.data)
                
                // Fetch questions details
                const questionDetails = await Promise.all(
                    response.data.questions.map(qNum => 
                        axios.get(`/api/questions/${qNum}`).then(res => res.data)
                    )
                )
                setQuestions(questionDetails)
            } catch (error) {
                console.error('Error fetching list details:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchListDetails()
    }, [id])

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this list?')) {
            try {
                await axios.delete(`/api/lists/${id}`)
                navigate('/lists')
            } catch (error) {
                console.error('Error deleting list:', error)
            }
        }
    }

    const handleLike = async () => {
        try {
            const response = await axios.post(`/api/lists/${id}/like`)
            setList(prev => ({
                ...prev,
                likes: response.data.likes
            }))
        } catch (error) {
            console.error('Error toggling like:', error)
        }
    }

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    }

    if (!list) return null

    return (
        <div className="container mx-auto px-4 py-8 mt-16">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2">{list.title}</h1>
                    <p className="text-base-content/70 mb-4">{list.description}</p>
                    
                    <div className="flex flex-wrap gap-4 items-center text-sm">
                        <div className="flex items-center gap-2">
                            <UserIcon className="w-4 h-4" />
                            <span>{list.creator.username}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{new Date(list.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {list.tags.map(tag => (
                                <span key={tag} className="badge badge-ghost">{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    {user && (user._id === list.creator._id || user.isAdmin) && (
                        <>
                            <Link to={`/lists/${id}/edit`} className="btn btn-ghost btn-sm">
                                <PencilSquareIcon className="w-5 h-5" />
                            </Link>
                            <button onClick={handleDelete} className="btn btn-ghost btn-sm text-error">
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </>
                    )}
                    <button onClick={handleLike} className="btn btn-ghost btn-sm">
                        <BookmarkIcon className="w-5 h-5" />
                    </button>
                    <button className="btn btn-ghost btn-sm">
                        <ShareIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Progress Section */}
            {list.progress && (
                <div className="card bg-base-200 mb-8">
                    <div className="card-body">
                        <div className="flex items-center gap-4 mb-4">
                            <ChartBarIcon className="w-6 h-6" />
                            <h2 className="text-xl font-bold">Your Progress</h2>
                        </div>
                        
                        <div className="stats shadow">
                            <div className="stat">
                                <div className="stat-title">Completion</div>
                                <div className="stat-value">{list.progress.percentage}%</div>
                                <div className="stat-desc">
                                    {list.progress.solved} / {list.progress.total} questions
                                </div>
                            </div>
                        </div>

                        <progress 
                            className="progress progress-primary w-full mt-4" 
                            value={list.progress.percentage} 
                            max="100"
                        />
                    </div>
                </div>
            )}

            {/* Questions Table */}
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Number</th>
                            <th>Title</th>
                            <th>Difficulty</th>
                            <th>Section</th>
                            <th>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((question) => (
                            <tr 
                                key={question._id}
                                className="hover cursor-pointer"
                                onClick={() => navigate(`/question/${question.questionNumber}`)}
                            >
                                <td>
                                    <div className={`w-3 h-3 rounded-full ${
                                        question.status === 'Solved' ? 'bg-success' :
                                        question.status === 'Attempted' ? 'bg-warning' :
                                        'bg-base-300'
                                    }`} />
                                </td>
                                <td>{question.questionNumber}</td>
                                <td>{question.title}</td>
                                <td>
                                    <span className={`badge ${
                                        question.difficulty === 'Hard' ? 'badge-error' :
                                        question.difficulty === 'Medium' ? 'badge-warning' :
                                        'badge-success'
                                    }`}>
                                        {question.difficulty}
                                    </span>
                                </td>
                                <td>{question.section}</td>
                                <td>{question.type}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default QuestionListDetail 