import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import { 
    PlusIcon, 
    MagnifyingGlassIcon,
    AdjustmentsHorizontalIcon,
    BookmarkIcon,
    ShareIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline'

const QuestionLists = () => {
    const { user } = useContext(AuthContext)
    const [lists, setLists] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filters, setFilters] = useState({
        search: '',
        creator: '',
        tags: '',
        isPublic: '',
        isOfficial: '',
        sort: 'recent'
    })
    const [page, setPage] = useState(1)
    const [pagination, setPagination] = useState({
        total: 0,
        pages: 1,
        page: 1,
        limit: 10
    })
    const [searchTimeout, setSearchTimeout] = useState(null)

    useEffect(() => {
        const fetchLists = async () => {
            setLoading(true)
            setError(null)
            try {
                const response = await axios.get('/api/lists', {
                    params: {
                        ...filters,
                        page
                    }
                })
                setLists(response.data.lists)
                setPagination(response.data.pagination)
            } catch (error) {
                console.error('Error fetching lists:', error)
                setError('Failed to load question lists. Please try again later.')
            } finally {
                setLoading(false)
            }
        }
        fetchLists()
    }, [filters, page])

    return (
        <div className="container mx-auto px-4 py-8 mt-16">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Question Lists</h1>
                {user && (
                    <Link to="/lists/new" className="btn btn-primary">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Create List
                    </Link>
                )}
            </div>

            {/* Filters Section */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex-1 min-w-[300px]">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search lists..."
                            className="input input-bordered w-full pl-10"
                            value={filters.search}
                            onChange={(e) => {
                                const value = e.target.value
                                setFilters(prev => ({ ...prev, search: value }))
                                
                                // Clear existing timeout
                                if (searchTimeout) clearTimeout(searchTimeout)
                                
                                // Set new timeout
                                const timeoutId = setTimeout(() => {
                                    setPage(1) // Reset to first page when searching
                                }, 500)
                                
                                setSearchTimeout(timeoutId)
                            }}
                        />
                        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                    </div>
                </div>

                <select 
                    className="select select-bordered"
                    value={filters.sort}
                    onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
                >
                    <option value="recent">Most Recent</option>
                    <option value="relevancy">Most Relevant</option>
                    <option value="likes">Most Liked</option>
                    <option value="questions">Most Questions</option>
                </select>

                <button className="btn btn-outline gap-2">
                    <AdjustmentsHorizontalIcon className="w-5 h-5" />
                    Filters
                </button>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-8">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="alert alert-error">
                    <span>{error}</span>
                </div>
            )}

            {/* Lists Grid */}
            {!loading && !error && lists.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-lg text-gray-600">No question lists found.</p>
                </div>
            )}

            {!loading && !error && lists.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lists.map(list => (
                        <div key={list._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                            <div className="card-body">
                                <div className="flex justify-between items-start">
                                    <h2 className="card-title">{list.title}</h2>
                                    {list.isOfficial && (
                                        <div className="badge badge-primary">Official</div>
                                    )}
                                </div>
                                
                                <p className="text-base-content/70 line-clamp-2">{list.description}</p>
                                
                                <div className="flex items-center gap-2 mt-2">
                                    <img 
                                        src={list.creator.profilePicture || '/default-avatar.png'} 
                                        alt={list.creator.username}
                                        className="w-6 h-6 rounded-full"
                                    />
                                    <span className="text-sm">{list.creator.username}</span>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {list.tags.map(tag => (
                                        <span key={tag} className="badge badge-ghost">{tag}</span>
                                    ))}
                                </div>

                                {/* Progress Bar (if user has started the list) */}
                                {list.progress && (
                                    <div className="mt-4">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>{list.progress.solved}/{list.progress.total} solved</span>
                                            <span>{list.progress.percentage}%</span>
                                        </div>
                                        <progress 
                                            className="progress progress-primary w-full" 
                                            value={list.progress.percentage} 
                                            max="100"
                                        />
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="card-actions justify-between items-center mt-4">
                                    <div className="flex gap-2">
                                        <button className="btn btn-ghost btn-sm">
                                            <BookmarkIcon className="w-5 h-5" />
                                        </button>
                                        <button className="btn btn-ghost btn-sm">
                                            <ShareIcon className="w-5 h-5" />
                                        </button>
                                        <div className="flex items-center gap-1">
                                            <UserGroupIcon className="w-5 h-5" />
                                            <span className="text-sm">{list.likes?.length || 0}</span>
                                        </div>
                                    </div>
                                    <Link 
                                        to={`/lists/${list._id}`} 
                                        className="btn btn-primary btn-sm"
                                    >
                                        View List
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center mt-8">
                <div className="join">
                    {Array.from({ length: pagination.pages }, (_, i) => (
                        <button
                            key={i + 1}
                            className={`join-item btn ${pagination.page === i + 1 ? 'btn-active' : ''}`}
                            onClick={() => setPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default QuestionLists 