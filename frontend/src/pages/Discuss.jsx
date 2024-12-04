import { useState, useEffect, useContext, useCallback } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'
import { 
    ChatBubbleLeftIcon, 
    PlusIcon,
    HeartIcon,
    HandThumbDownIcon,
    EyeIcon,
    MapPinIcon
} from '@heroicons/react/24/outline'

const Discuss = () => {
    const { user } = useContext(AuthContext)
    const [discussions, setDiscussions] = useState([])
    const [category, setCategory] = useState('General')
    const [sortBy, setSortBy] = useState('latest')

    const fetchDiscussions = useCallback(async () => {
        try {
            const response = await axios.get(`/api/discussions?category=${category}&sort=${sortBy}`)
            setDiscussions(response.data)
        } catch (error) {
            console.error('Error fetching discussions:', error)
        }
    }, [category, sortBy])

    useEffect(() => {
        fetchDiscussions()
    }, [fetchDiscussions])

    const handleLike = async (discussionId) => {
        const token = localStorage.getItem('authToken')
        try {
            await axios.post(`/api/discussions/${discussionId}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchDiscussions()
        } catch (error) {
            console.error('Error liking discussion:', error)
        }
    }

    const handleDislike = async (discussionId) => {
        const token = localStorage.getItem('authToken')
        try {
            await axios.post(`/api/discussions/${discussionId}/dislike`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchDiscussions()
        } catch (error) {
            console.error('Error disliking discussion:', error)
        }
    }

    const incrementViewCount = async (discussionId) => {
        try {
            await axios.post(`/api/discussions/view/${discussionId}`)
        } catch (error) {
            console.error('Error incrementing view count:', error)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Community Discussions</h1>
                {user && (
                    <Link to="/discuss/new" className="btn btn-primary">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        New Discussion
                    </Link>
                )}
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
                <select 
                    className="select select-bordered w-full max-w-xs"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="General">General</option>
                    <option value="Questions">Questions</option>
                    <option value="Tips">Tips</option>
                    <option value="Exams">Exams</option>
                    <option value="Jobs">Jobs</option>
                    <option value="Interview">Interview</option>
                    <option value="News">News</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Other">Other</option>
                </select>

                <select 
                    className="select select-bordered w-full max-w-xs"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="latest">Latest</option>
                    <option value="popular">Most Popular</option>
                    <option value="views">Most Viewed</option>
                </select>
            </div>

            {/* Discussions List */}
            <div className="space-y-4">
                {discussions.map((discussion) => (
                    <div key={discussion._id} className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <div className="flex items-start gap-4">
                                <img 
                                    src={discussion.userId.profilePicture || '/default-avatar.png'} 
                                    alt="Profile" 
                                    className="w-12 h-12 rounded-full"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        {discussion.isPinned && (
                                            <MapPinIcon className="w-5 h-5 text-primary" />
                                        )}
                                        <Link 
                                            to={`/discuss/${discussion._id}`}
                                            className="text-xl font-bold hover:text-primary"
                                            onClick={() => incrementViewCount(discussion._id)}
                                        >
                                            {discussion.title}
                                        </Link>
                                    </div>
                                    <p className="text-sm text-base-content/70">
                                        Posted by {discussion.userId.username} • {moment(discussion.createdAt).fromNow()}
                                    </p>
                                    <p className="mt-2">{discussion.content.substring(0, 200)}...</p>
                                    
                                    <div className="flex items-center gap-6 mt-4">
                                        <div className="flex items-center gap-2">
                                            <ChatBubbleLeftIcon className="w-5 h-5" />
                                            <span>{discussion.replies.length}</span>
                                        </div>
                                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleLike(discussion._id)}>
                                            <HeartIcon className="w-5 h-5" />
                                            <span>{discussion.likes.length}</span>
                                        </div>
                                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleDislike(discussion._id)}>
                                            <HandThumbDownIcon className="w-5 h-5" />
                                            <span>{discussion.dislikes.length}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <EyeIcon className="w-5 h-5" />
                                            <span>{discussion.views}</span>
                                        </div>
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

export default Discuss