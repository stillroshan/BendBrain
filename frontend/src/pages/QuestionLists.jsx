import { useState, useEffect, useContext, useCallback } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import {
    MagnifyingGlassIcon,
    PlusIcon
} from '@heroicons/react/24/outline'
import ListCard from '../components/lists/ListCard'
import { AuthContext } from '../context/AuthContext'

const QuestionLists = () => {
    const { user, token } = useContext(AuthContext)
    const [lists, setLists] = useState([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        difficulty: '',
        sortBy: 'popular'
    })
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0
    })

    const fetchLists = useCallback(async () => {
        try {
            setLoading(true)
            const params = {
                ...filters,
                page: pagination.page,
                limit: pagination.limit
            }
            
            const { data } = await axios.get('/api/lists', { 
                params,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setLists(data.lists)
            setPagination(prev => ({
                ...prev,
                total: data.pagination.total
            }))
        } catch (error) {
            console.error('Error fetching lists:', error)
        } finally {
            setLoading(false)
        }
    }, [filters, pagination.page, pagination.limit, token])

    useEffect(() => {
        fetchLists()
    }, [fetchLists])

    const handleFilterChange = (e) => {
        const { name, value } = e.target
        setFilters(prev => ({
            ...prev,
            [name]: value
        }))
        setPagination(prev => ({ ...prev, page: 1 })) // Reset to first page
    }

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }))
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-16">
            {/* Hero Section */}
            <div className="hero bg-base-200 rounded-box p-8 mb-8">
                <div className="hero-content text-center">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl font-bold mb-4">Question Lists</h1>
                        <p className="text-lg text-base-content/70 mb-6">
                            Discover curated question lists to enhance your practice. Create your own lists or explore official ones.
                        </p>
                        {user && (
                            <Link to="/lists/create" className="btn btn-primary btn-lg">
                                <PlusIcon className="w-5 h-5 mr-2" />
                                Create New List
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-base-100 rounded-box shadow-lg p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="form-control">
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            fetchLists();
                        }} className="input-group">
                            <input
                                type="text"
                                placeholder="Search lists..."
                                className="input input-bordered w-full"
                                name="search"
                                value={filters.search}
                                onChange={handleFilterChange}
                            />
                            <button type="submit" className="btn btn-primary">
                                <MagnifyingGlassIcon className="w-5 h-5" />
                                Search
                            </button>
                        </form>
                    </div>

                    <select
                        className="select select-bordered w-full"
                        name="category"
                        value={filters.category}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Categories</option>
                        <option value="Interview Prep">Interview Prep</option>
                        <option value="Topic Wise">Topic Wise</option>
                        <option value="Company Specific">Company Specific</option>
                        <option value="Custom">Custom</option>
                    </select>

                    <select
                        className="select select-bordered w-full"
                        name="difficulty"
                        value={filters.difficulty}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Difficulties</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                        <option value="Mixed">Mixed</option>
                    </select>

                    <select
                        className="select select-bordered w-full"
                        name="sortBy"
                        value={filters.sortBy}
                        onChange={handleFilterChange}
                    >
                        <option value="popular">Most Popular</option>
                        <option value="recent">Most Recent</option>
                        <option value="solved">Most Solved</option>
                    </select>
                </div>
            </div>

            {/* Lists Grid with Animation */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lists.map((list, index) => (
                    <div
                        key={list._id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <ListCard 
                            list={list}
                            onSave={fetchLists}
                        />
                    </div>
                ))}
            </div>

            {/* Enhanced Pagination */}
            <div className="flex justify-center mt-12">
                <div className="join">
                    <button
                        className="join-item btn"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                    >
                        «
                    </button>
                    {Array.from({ length: Math.ceil(pagination.total / pagination.limit) }).map((_, idx) => {
                        const pageNum = idx + 1;
                        // Show only 5 pages around current page
                        if (
                            pageNum === 1 ||
                            pageNum === Math.ceil(pagination.total / pagination.limit) ||
                            (pageNum >= pagination.page - 2 && pageNum <= pagination.page + 2)
                        ) {
                            return (
                                <button
                                    key={pageNum}
                                    className={`join-item btn ${pageNum === pagination.page ? 'btn-active' : ''}`}
                                    onClick={() => handlePageChange(pageNum)}
                                >
                                    {pageNum}
                                </button>
                            );
                        }
                        // Add ellipsis for skipped pages
                        if (
                            pageNum === pagination.page - 3 ||
                            pageNum === pagination.page + 3
                        ) {
                            return (
                                <button key={pageNum} className="join-item btn btn-disabled">
                                    ...
                                </button>
                            );
                        }
                        return null;
                    })}
                    <button
                        className="join-item btn"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === Math.ceil(pagination.total / pagination.limit)}
                    >
                        »
                    </button>
                </div>
            </div>
        </div>
    )
}

export default QuestionLists 