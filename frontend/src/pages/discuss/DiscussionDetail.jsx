import { useState, useEffect, useContext, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import moment from 'moment'
import { 
    HeartIcon,
    HandThumbDownIcon,
    ArrowUturnLeftIcon,
    ChatBubbleLeftIcon,
    EyeIcon,
    ShareIcon,
    BookmarkIcon,
    FlagIcon
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
        if (!newReply.trim()) return
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
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        )
    }

    if (!discussion) {
        return <div className="text-center py-12">Discussion not found</div>
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl mt-16">
            <button 
                onClick={() => navigate('/discuss')} 
                className="btn btn-ghost gap-2 mb-6"
            >
                <ArrowUturnLeftIcon className="w-5 h-5" />
                Back to Discussions
            </button>

            <div className="card bg-base-100 shadow-xl mb-8">
                <div className="card-body">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <img 
                                src={discussion.userId.profilePicture || '/default-avatar.png'}
                                alt="Profile"
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                                <h1 className="text-2xl font-bold">{discussion.title}</h1>
                                <div className="flex items-center gap-3 text-base-content/70">
                                    <span>{discussion.userId.username}</span>
                                    <span>•</span>
                                    <span>{moment(discussion.createdAt).fromNow()}</span>
                                    <span>•</span>
                                    <span className="badge badge-ghost">{discussion.category}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="btn btn-ghost btn-sm">
                                <ShareIcon className="w-5 h-5" />
                            </button>
                            <button className="btn btn-ghost btn-sm">
                                <BookmarkIcon className="w-5 h-5" />
                            </button>
                            <button className="btn btn-ghost btn-sm text-error">
                                <FlagIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="prose max-w-none mb-6">
                        <p className="text-lg">{discussion.content}</p>
                    </div>

                    <div className="flex items-center gap-6 border-t pt-4">
                        <button 
                            className="btn btn-ghost gap-2"
                            onClick={handleLike}
                        >
                            <HeartIcon className={`w-5 h-5 ${discussion.likes.includes(user?._id) ? 'fill-current text-primary' : ''}`} />
                            <span>{discussion.likes.length}</span>
                        </button>
                        <button 
                            className="btn btn-ghost gap-2"
                            onClick={handleDislike}
                        >
                            <HandThumbDownIcon className={`w-5 h-5 ${discussion.dislikes.includes(user?._id) ? 'fill-current text-error' : ''}`} />
                            <span>{discussion.dislikes.length}</span>
                        </button>
                        <div className="flex items-center gap-2 text-base-content/70">
                            <ChatBubbleLeftIcon className="w-5 h-5" />
                            <span>{discussion.replies.length} replies</span>
                        </div>
                        <div className="flex items-center gap-2 text-base-content/70">
                            <EyeIcon className="w-5 h-5" />
                            <span>{discussion.views} views</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <ChatBubbleLeftIcon className="w-6 h-6" />
                    Replies
                </h2>

                {user && (
                    <div className="card bg-base-100 shadow-xl mb-6">
                        <div className="card-body">
                            <div className="flex items-start gap-4">
                                <img 
                                    src={user.profilePicture || '/default-avatar.png'}
                                    alt="Your profile"
                                    className="w-10 h-10 rounded-full"
                                />
                                <div className="flex-1">
                                    <textarea
                                        className="textarea textarea-bordered w-full"
                                        placeholder="Write your reply..."
                                        rows="3"
                                        value={newReply}
                                        onChange={(e) => setNewReply(e.target.value)}
                                    />
                                    <div className="flex justify-end mt-2">
                                        <button 
                                            className="btn btn-primary"
                                            onClick={handleReply}
                                            disabled={!newReply.trim()}
                                        >
                                            Post Reply
                                        </button>
                                    </div>
                                </div>
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
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">{reply.userId.username}</span>
                                                <span className="text-base-content/70">•</span>
                                                <span className="text-base-content/70">{moment(reply.createdAt).fromNow()}</span>
                                            </div>
                                        </div>
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