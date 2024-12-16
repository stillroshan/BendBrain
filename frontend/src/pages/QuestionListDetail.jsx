import { useState, useEffect, useContext, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import {
    UserCircleIcon,
    HeartIcon,
    BookmarkIcon,
    PencilIcon,
    CheckCircleIcon,
    MinusCircleIcon,
    TagIcon
} from '@heroicons/react/24/outline'
import {
    HeartIcon as HeartIconSolid,
    BookmarkIcon as BookmarkIconSolid
} from '@heroicons/react/24/solid'
import { AuthContext } from '../context/AuthContext'

const QuestionListDetail = () => {
    const { id } = useParams()
    const { user, token } = useContext(AuthContext)
    const [list, setList] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [liking, setLiking] = useState(false)

    const fetchList = useCallback(async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(`/api/lists/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setList(data)
        } catch (error) {
            console.error('Error fetching list:', error)
        } finally {
            setLoading(false)
        }
    }, [id, token])

    useEffect(() => {
        fetchList()
    }, [fetchList])

    const handleSave = async () => {
        if (!user) return
        try {
            setSaving(true)
            await axios.post(`/api/lists/${id}/save`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            fetchList()
        } catch (error) {
            console.error('Error saving list:', error)
        } finally {
            setSaving(false)
        }
    }

    const handleLike = async () => {
        if (!user) return
        try {
            setLiking(true)
            await axios.post(`/api/lists/${id}/like`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            fetchList()
        } catch (error) {
            console.error('Error liking list:', error)
        } finally {
            setLiking(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        )
    }

    if (!list) return <div>List not found</div>

    return (
        <div className="container mx-auto px-4 py-8 mt-16">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{list.title}</h1>
                    <div className="flex items-center gap-4 text-base-content/70">
                        <div className="flex items-center gap-2">
                            <UserCircleIcon className="w-5 h-5" />
                            <span>{list.creator.username}</span>
                        </div>
                        {list.isOfficial && (
                            <div className="badge badge-primary">Official</div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    {user && list.creator._id === user._id && (
                        <Link 
                            to={`/lists/${id}/edit`}
                            className="btn btn-outline"
                        >
                            <PencilIcon className="w-5 h-5" />
                            Edit
                        </Link>
                    )}
                    {user && (
                        <>
                            <button 
                                className={`btn btn-outline ${liking ? 'loading' : ''}`}
                                onClick={handleLike}
                                disabled={liking}
                            >
                                {list.userInteraction?.liked ? (
                                    <HeartIconSolid className="w-5 h-5 text-error" />
                                ) : (
                                    <HeartIcon className="w-5 h-5" />
                                )}
                                {list.stats.likes.length}
                            </button>
                            <button 
                                className={`btn btn-outline ${saving ? 'loading' : ''}`}
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {list.userInteraction?.saved ? (
                                    <BookmarkIconSolid className="w-5 h-5 text-primary" />
                                ) : (
                                    <BookmarkIcon className="w-5 h-5" />
                                )}
                                {list.stats.saves.length}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Description and Metadata */}
            <div className="card bg-base-100 shadow-xl mb-8">
                <div className="card-body">
                    <p className="text-base-content/70 mb-4">{list.description}</p>
                    
                    <div className="flex flex-wrap gap-4">
                        <div className="badge badge-outline">{list.difficulty}</div>
                        <div className="badge badge-outline">{list.category}</div>
                        {list.tags.map(tag => (
                            <div key={tag} className="badge badge-outline">
                                <TagIcon className="w-4 h-4 mr-1" />
                                {tag}
                            </div>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="stats stats-horizontal shadow mt-4">
                        <div className="stat">
                            <div className="stat-title">Questions</div>
                            <div className="stat-value">{list.metadata.totalQuestions}</div>
                        </div>
                        <div className="stat">
                            <div className="stat-title">Easy</div>
                            <div className="stat-value text-success">
                                {list.metadata.difficultyDistribution.easy}
                            </div>
                        </div>
                        <div className="stat">
                            <div className="stat-title">Medium</div>
                            <div className="stat-value text-warning">
                                {list.metadata.difficultyDistribution.medium}
                            </div>
                        </div>
                        <div className="stat">
                            <div className="stat-title">Hard</div>
                            <div className="stat-value text-error">
                                {list.metadata.difficultyDistribution.hard}
                            </div>
                        </div>
                    </div>

                    {/* Progress */}
                    {list.userProgress && (
                        <div className="mt-4">
                            <div className="flex justify-between text-sm mb-1">
                                <span>Your Progress</span>
                                <span>
                                    {list.userProgress.solvedQuestions.length} / {list.metadata.totalQuestions} questions
                                </span>
                            </div>
                            <progress 
                                className="progress progress-primary w-full" 
                                value={list.userProgress.completionPercentage} 
                                max="100"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Questions Table */}
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Title</th>
                            <th>Difficulty</th>
                            <th>Section</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.questions.map((question) => (
                            <tr key={question.questionId._id}>
                                <td>
                                    {question.solved ? (
                                        <CheckCircleIcon className="w-6 h-6 text-success" />
                                    ) : (
                                        <MinusCircleIcon className="w-6 h-6 text-base-content/30" />
                                    )}
                                </td>
                                <td>{question.questionId.title}</td>
                                <td>
                                    <div className={`badge ${
                                        question.questionId.difficulty === 'Easy' ? 'badge-success' :
                                        question.questionId.difficulty === 'Medium' ? 'badge-warning' :
                                        'badge-error'
                                    }`}>
                                        {question.questionId.difficulty}
                                    </div>
                                </td>
                                <td>{question.questionId.section}</td>
                                <td>
                                    <Link 
                                        to={`/questions/${question.questionId._id}`}
                                        className="btn btn-primary btn-sm"
                                    >
                                        Solve
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default QuestionListDetail 