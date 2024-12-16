import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'
import { 
    PencilIcon, 
    TagIcon, 
    ChatBubbleBottomCenterTextIcon,
    XMarkIcon,
    ArrowUturnLeftIcon
} from '@heroicons/react/24/outline'

const NewDiscussion = () => {
    const navigate = useNavigate()
    const { user } = useContext(AuthContext)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'General',
        tags: []
    })
    const [newTag, setNewTag] = useState('')

    const categories = [
        'General',
        'Questions',
        'Question Number',
        'Tips',
        'Exams',
        'Jobs',
        'Interview',
        'News',
        'Feedback',
        'Other'
    ]

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const token = localStorage.getItem('authToken')
            await axios.post('/api/discussions', formData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            navigate('/discuss')
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    const handleAddTag = (e) => {
        e.preventDefault()
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }))
            setNewTag('')
        }
    }

    const removeTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }))
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl mt-16">
            {/* Navigation */}
            <button 
                onClick={() => navigate('/discuss')} 
                className="btn btn-ghost gap-2 mb-6"
            >
                <ArrowUturnLeftIcon className="w-5 h-5" />
                Back to Discussions
            </button>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="flex items-center gap-4 mb-6">
                        <img 
                            src={user?.profilePicture || '/default-avatar.png'} 
                            alt="Profile" 
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                            <h1 className="text-2xl font-bold">Create New Discussion</h1>
                            <p className="text-base-content/70">Share your thoughts with the community</p>
                        </div>
                    </div>

                    {error && (
                        <div className="alert alert-error mb-6">
                            <XMarkIcon className="w-5 h-5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title Input */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold flex items-center gap-2">
                                    <PencilIcon className="w-5 h-5" />
                                    Title
                                </span>
                            </label>
                            <input 
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                className="input input-bordered w-full"
                                placeholder="Enter a descriptive title"
                                required
                            />
                        </div>

                        {/* Category Select */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold flex items-center gap-2">
                                    <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
                                    Category
                                </span>
                            </label>
                            <select 
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                className="select select-bordered w-full"
                                required
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Content Textarea */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Content</span>
                            </label>
                            <textarea 
                                value={formData.content}
                                onChange={(e) => setFormData({...formData, content: e.target.value})}
                                className="textarea textarea-bordered min-h-[200px]"
                                placeholder="Write your discussion content here..."
                                required
                            />
                        </div>

                        {/* Tags Input */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold flex items-center gap-2">
                                    <TagIcon className="w-5 h-5" />
                                    Tags
                                </span>
                            </label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {formData.tags.map(tag => (
                                    <div key={tag} 
                                        className="badge badge-primary badge-lg gap-2"
                                    >
                                        {tag}
                                        <button 
                                            onClick={() => removeTag(tag)}
                                            className="btn btn-ghost btn-xs btn-circle"
                                        >
                                            <XMarkIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    className="input input-bordered flex-1"
                                    placeholder="Add tags (press Enter)"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleAddTag(e)
                                        }
                                    }}
                                />
                                <button 
                                    onClick={handleAddTag}
                                    className="btn btn-primary"
                                >
                                    Add Tag
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="card-actions justify-end">
                            <button 
                                type="button" 
                                className="btn btn-ghost"
                                onClick={() => navigate('/discuss')}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Create Discussion'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default NewDiscussion