import { useState, useEffect, useContext, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'
import moment from 'moment'
import { 
    HeartIcon,
    HandThumbDownIcon,
    ArrowUturnLeftIcon,
} from '@heroicons/react/24/outline'

const DiscussionDetail = () => {
    const { id } = useParams()
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()
    const [discussion, setDiscussion] = useState(null)
    const [newReply, setNewReply] = useState('')
    const [loading, setLoading] = useState(true)

    const fetchDiscussion = useCallback(async () => {
        try {
            const response = await axios.get(`/api/discussions/${id}`)
            setDiscussion(response.data)
        } catch (error) {
            console.error('Error fetching discussion:', error)
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        fetchDiscussion()
    }, [fetchDiscussion])

    const handleReply = async () => {
        const token = localStorage.getItem('authToken')
        try {
            await axios.post(`/api/discussions/${id}/reply`, {
                content: newReply
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setNewReply('')
            fetchDiscussion()
        } catch (error) {
            console.error('Error posting reply:', error)
        }
    }

    const handleLike = async () => {
        const token = localStorage.getItem('authToken')
        try {
            await axios.post(`/api/discussions/${id}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchDiscussion()
        } catch (error) {
            console.error('Error liking discussion:', error)
        }
    }

    const handleDislike = async () => {
        const token = localStorage.getItem('authToken')
        try {
            await axios.post(`/api/discussions/${id}/dislike`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchDiscussion()
        } catch (error) {
            console.error('Error disliking discussion:', error)
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }

    if (!discussion) {
        return <div>Discussion not found</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <button 
                onClick={() => navigate('/discuss')} 
                className="btn btn-ghost mb-4"
            >
                <ArrowUturnLeftIcon className="w-5 h-5 mr-2" />
                Back to Discussions
            </button>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="flex items-start gap-4">
                        <img 
                            src={discussion.userId.profilePicture || '/default-avatar.png'}
                            alt="Profile"
                            className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold">{discussion.title}</h1>
                            <p className="text-sm text-base-content/70">
                                Posted by {discussion.userId.username} • {moment(discussion.createdAt).fromNow()}
                            </p>
                            <p className="mt-4">{discussion.content}</p>
                            
                            <div className="flex items-center gap-6 mt-4">
                                <button 
                                    className="btn btn-ghost btn-sm gap-2"
                                    onClick={handleLike}
                                >
                                    <HeartIcon className="w-5 h-5" />
                                    <span>{discussion.likes.length}</span>
                                </button>
                                <button 
                                    className="btn btn-ghost btn-sm gap-2"
                                    onClick={handleDislike}
                                >
                                    <HandThumbDownIcon className="w-5 h-5" />
                                    <span>{discussion.dislikes.length}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Replies Section */}
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Replies</h2>
                
                {user && (
                    <div className="card bg-base-100 shadow-xl mb-6">
                        <div className="card-body">
                            <textarea
                                className="textarea textarea-bordered w-full"
                                placeholder="Write a reply..."
                                rows="3"
                                value={newReply}
                                onChange={(e) => setNewReply(e.target.value)}
                            />
                            <div className="card-actions justify-end">
                                <button 
                                    className="btn btn-primary"
                                    onClick={handleReply}
                                >
                                    Post Reply
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {discussion.replies.map((reply, index) => (
                        <div key={index} className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <div className="flex items-start gap-4">
                                    <img 
                                        src={reply.userId.profilePicture || '/default-avatar.png'}
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div>
                                        <p className="text-sm text-base-content/70">
                                            {reply.userId.username} • {moment(reply.createdAt).fromNow()}
                                        </p>
                                        <p className="mt-2">{reply.content}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default DiscussionDetail 