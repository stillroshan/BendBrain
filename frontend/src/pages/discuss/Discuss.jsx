import { useState, useEffect, useContext, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import moment from 'moment'
import { 
    PlusIcon, 
    HeartIcon, 
    HandThumbDownIcon,
    ChatBubbleLeftIcon,
    MapPinIcon,
    EyeIcon,
    FunnelIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { HandThumbDownIcon as HandThumbDownIconSolid } from '@heroicons/react/24/solid'

const Discuss = () => {
    const { user } = useContext(AuthContext)
    const [discussions, setDiscussions] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [category, setCategory] = useState('')

    const categories = [
        'General', 'Questions', 'Question Number', 'Tips', 
        'Exams', 'Jobs', 'Interview', 'News', 'Feedback', 'Other'
    ]

    const fetchDiscussions = useCallback(async () => {
        try {
            const params = {}
            if (filter !== 'all') params.filter = filter
            if (category) params.category = category

            const response = await axios.get('/api/discussions', { params })
            setDiscussions(response.data)
        } catch (error) {
            console.error('Error fetching discussions:', error)
        } finally {
            setLoading(false)
        }
    }, [filter, category])

    useEffect(() => {
        fetchDiscussions()
    }, [fetchDiscussions])

    const handleLike = async (discussionId) => {
        try {
            const token = localStorage.getItem('authToken')
            await axios.post(`/api/discussions/${discussionId}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchDiscussions()
        } catch (error) {
            console.error('Error liking discussion:', error)
        }
    }

    const handleDislike = async (discussionId) => {
        try {
            const token = localStorage.getItem('authToken')
            await axios.post(`/api/discussions/${discussionId}/dislike`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchDiscussions()
        } catch (error) {
            console.error('Error disliking discussion:', error)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl mt-16">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Discussions</h1>
                    <p className="text-base-content/70">
                        Join the conversation with fellow learners
                    </p>
                </div>
                {user && (
                    <Link to="/discuss/new" className="btn btn-primary gap-2">
                        <PlusIcon className="w-5 h-5" />
                        New Discussion
                    </Link>
                )}
            </div>

            {/* Filters Section */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-4 bg-base-200 p-2 rounded-lg flex-1">
                    <FunnelIcon className="w-5 h-5" />
                    <select 
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="select select-ghost"
                    >
                        <option value="all">All Discussions</option>
                        <option value="trending">Trending</option>
                        <option value="recent">Recent</option>
                        <option value="most-liked">Most Liked</option>
                    </select>
                </div>
                <div className="flex items-center gap-4 bg-base-200 p-2 rounded-lg flex-1">
                    <ChatBubbleLeftIcon className="w-5 h-5" />
                    <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="select select-ghost"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Discussions List */}
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : (
                <div className="space-y-6">
                    {discussions.map((discussion) => (
                        <div key={discussion._id} 
                            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
                        >
                            <div className="card-body">
                                <div className="flex items-start gap-4">
                                    <img 
                                        src={discussion.userId.profilePicture || '/default-avatar.png'} 
                                        alt="Profile" 
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            {discussion.isPinned && (
                                                <div className="badge badge-primary gap-1">
                                                    <MapPinIcon className="w-4 h-4" />
                                                    Pinned
                                                </div>
                                            )}
                                            <div className="badge badge-ghost">{discussion.category}</div>
                                        </div>
                                        
                                        <Link to={`/discuss/${discussion._id}`}>
                                            <h2 className="text-xl font-bold hover:text-primary transition-colors">
                                                {discussion.title}
                                            </h2>
                                        </Link>
                                        
                                        <p className="text-sm text-base-content/70 mt-1">
                                            Posted by {discussion.userId.username} • {moment(discussion.createdAt).fromNow()}
                                        </p>
                                        
                                        <p className="mt-3 line-clamp-2">{discussion.content}</p>

                                        <div className="flex items-center gap-6 mt-4">
                                            <button 
                                                className="btn btn-ghost btn-sm gap-2"
                                                onClick={() => handleLike(discussion._id)}
                                            >
                                                {discussion.likes.includes(user?._id) ? (
                                                    <HeartIconSolid className="w-5 h-5 text-primary" />
                                                ) : (
                                                    <HeartIcon className="w-5 h-5" />
                                                )}
                                                <span>{discussion.likes.length}</span>
                                            </button>
                                            <button 
                                                className="btn btn-ghost btn-sm gap-2"
                                                onClick={() => handleDislike(discussion._id)}
                                            >
                                                {discussion.dislikes.includes(user?._id) ? (
                                                    <HandThumbDownIconSolid className="w-5 h-5 text-primary" />
                                                ) : (
                                                    <HandThumbDownIcon className="w-5 h-5" />
                                                )}
                                                <span>{discussion.dislikes.length}</span>
                                            </button>
                                            <div className="flex items-center gap-2 text-base-content/70">
                                                <ChatBubbleLeftIcon className="w-5 h-5" />
                                                <span>{discussion.replies?.length || 0} replies</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-base-content/70">
                                                <EyeIcon className="w-5 h-5" />
                                                <span>{discussion.views} views</span>
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        {discussion.tags && discussion.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-4">
                                                {discussion.tags.map(tag => (
                                                    <span key={tag} className="badge badge-ghost">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Discuss