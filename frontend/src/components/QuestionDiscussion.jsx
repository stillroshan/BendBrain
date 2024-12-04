import { useState, useEffect, useContext, useCallback } from 'react'
import { AuthContext } from '../context/AuthContext'
import PropTypes from 'prop-types'
import axios from 'axios'
import moment from 'moment'
import { 
    HeartIcon,
    HandThumbDownIcon,
    ArrowUturnLeftIcon
} from '@heroicons/react/24/outline'

const QuestionDiscussion = ({ questionId }) => {
    const { user } = useContext(AuthContext)
    const [discussions, setDiscussions] = useState([])
    const [newReply, setNewReply] = useState('')

    const fetchDiscussions = useCallback(async () => {
        try {
            const response = await axios.get(`/api/discussions/question/${questionId}`)
            setDiscussions(response.data)
        } catch (error) {
            console.error('Error fetching discussions:', error)
        }
    }, [questionId])

    useEffect(() => {
        fetchDiscussions()
    }, [fetchDiscussions])

    const handleReply = async (discussionId) => {
        const token = localStorage.getItem('authToken')
        try {
            if (!discussionId) {
                await axios.post('/api/discussions', {
                    title: `Discussion on Question ${questionId}`,
                    content: newReply,
                    questionId: questionId,
                    category: 'Questions'
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            } else {
                await axios.post(`/api/discussions/${discussionId}/reply`, {
                    content: newReply
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            }
            setNewReply('')
            fetchDiscussions()
        } catch (error) {
            console.error('Error posting reply:', error)
        }
    }

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Discussion</h2>
            
            {/* New Discussion Form */}
            {user && (
                <div className="card bg-base-100 shadow-xl mb-6">
                    <div className="card-body">
                        <textarea
                            className="textarea textarea-bordered w-full"
                            placeholder="Start a discussion..."
                            rows="3"
                            value={newReply}
                            onChange={(e) => setNewReply(e.target.value)}
                        />
                        <div className="card-actions justify-end">
                            <button 
                                className="btn btn-primary"
                                onClick={() => handleReply(questionId)}
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Discussions List */}
            <div className="space-y-4">
                {discussions.map((discussion) => (
                    <div key={discussion._id} className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <div className="flex items-start gap-4">
                                <img 
                                    src={discussion.userId.profilePicture || '/default-avatar.png'}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full"
                                />
                                <div className="flex-1">
                                    <p className="text-sm text-base-content/70">
                                        {discussion.userId.username} • {moment(discussion.createdAt).fromNow()}
                                    </p>
                                    <p className="mt-2">{discussion.content}</p>
                                    
                                    <div className="flex items-center gap-4 mt-4">
                                        <button className="btn btn-ghost btn-sm gap-2">
                                            <HeartIcon className="w-4 h-4" />
                                            <span>{discussion.likes.length}</span>
                                        </button>
                                        <button className="btn btn-ghost btn-sm gap-2">
                                            <HandThumbDownIcon className="w-4 h-4" />
                                            <span>{discussion.dislikes.length}</span>
                                        </button>
                                        <button className="btn btn-ghost btn-sm gap-2">
                                            <ArrowUturnLeftIcon className="w-4 h-4" />
                                            Reply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

QuestionDiscussion.propTypes = {
    questionId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired
}

export default QuestionDiscussion 