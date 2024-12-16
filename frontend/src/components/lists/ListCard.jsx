import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import {
    HeartIcon,
    BookmarkIcon,
    UserCircleIcon
} from '@heroicons/react/24/outline'
import {
    HeartIcon as HeartIconSolid,
    BookmarkIcon as BookmarkIconSolid
} from '@heroicons/react/24/solid'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'
import PropTypes from 'prop-types'

const ListCard = ({ list, onSave }) => {
    const { user, token } = useContext(AuthContext)
    const [saving, setSaving] = useState(false)
    const [liking, setLiking] = useState(false)

    const handleSave = async (e) => {
        e.preventDefault()
        if (!user) return // Handle unauthorized case

        try {
            setSaving(true)
            await axios.post(`/api/lists/${list._id}/save`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            onSave?.() // Refresh lists after save
        } catch (error) {
            console.error('Error saving list:', error)
        } finally {
            setSaving(false)
        }
    }

    const handleLike = async (e) => {
        e.preventDefault()
        if (!user) return // Handle unauthorized case

        try {
            setLiking(true)
            await axios.post(`/api/lists/${list._id}/like`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            onSave?.() // Refresh lists after like
        } catch (error) {
            console.error('Error liking list:', error)
        } finally {
            setLiking(false)
        }
    }

    return (
        <Link to={`/lists/${list._id}`} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="card-title">{list.title}</h2>
                        <div className="flex items-center gap-2 text-sm text-base-content/70">
                            <UserCircleIcon className="w-4 h-4" />
                            <span>{list.creator.username}</span>
                        </div>
                    </div>
                    {list.isOfficial && (
                        <div className="badge badge-primary">Official</div>
                    )}
                </div>

                {/* Description */}
                <p className="text-base-content/70 line-clamp-2">{list.description}</p>

                {/* Stats */}
                <div className="stats stats-horizontal shadow mt-4">
                    <div className="stat place-items-center">
                        <div className="stat-title">Questions</div>
                        <div className="stat-value text-lg">{list.metadata.totalQuestions}</div>
                    </div>
                    <div className="stat place-items-center">
                        <div className="stat-title">Saves</div>
                        <div className="stat-value text-lg">{typeof list.stats?.saves === 'number' ? list.stats.saves : 0}</div>
                    </div>
                    <div className="stat place-items-center">
                        <div className="stat-title">Likes</div>
                        <div className="stat-value text-lg">{list.stats.likes.length}</div>
                    </div>
                </div>

                {/* Progress (if user has started the list) */}
                {list.userProgress && (
                    <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{list.userProgress.completionPercentage.toFixed(1)}%</span>
                        </div>
                        <progress 
                            className="progress progress-primary w-full" 
                            value={list.userProgress.completionPercentage} 
                            max="100"
                        />
                    </div>
                )}

                {/* Actions */}
                {user && (
                    <div className="card-actions justify-end mt-4">
                        <button 
                            className={`btn btn-ghost btn-sm ${liking ? 'loading' : ''}`}
                            onClick={handleLike}
                            disabled={liking}
                        >
                            {list.userInteraction?.liked ? (
                                <HeartIconSolid className="w-5 h-5 text-error" />
                            ) : (
                                <HeartIcon className="w-5 h-5" />
                            )}
                        </button>
                        <button 
                            className={`btn btn-ghost btn-sm ${saving ? 'loading' : ''}`}
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {list.userInteraction?.saved ? (
                                <BookmarkIconSolid className="w-5 h-5 text-primary" />
                            ) : (
                                <BookmarkIcon className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                )}
            </div>
        </Link>
    )
}

ListCard.propTypes = {
    list: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        creator: PropTypes.shape({
            username: PropTypes.string
        }),
        stats: PropTypes.shape({
            saves: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
            likes: PropTypes.oneOfType([PropTypes.number, PropTypes.array])
        }),
        metadata: PropTypes.shape({
            totalQuestions: PropTypes.number
        }),
        isOfficial: PropTypes.bool,
        userProgress: PropTypes.object,
        userInteraction: PropTypes.object
    }).isRequired,
    onSave: PropTypes.func
}

export default ListCard 