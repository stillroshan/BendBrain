import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'

const NewDiscussion = () => {
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'General',
        tags: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem('authToken')
        
        try {
            await axios.post('/api/discussions', {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim())
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            navigate('/discuss')
        } catch (error) {
            console.error('Error creating discussion:', error)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Create New Discussion</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="label">
                        <span className="label-text">Title</span>
                    </label>
                    <input 
                        type="text"
                        className="input input-bordered w-full"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required
                    />
                </div>

                <div>
                    <label className="label">
                        <span className="label-text">Category</span>
                    </label>
                    <select 
                        className="select select-bordered w-full"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                        <option value="General">General</option>
                        <option value="Questions">Questions</option>
                        <option value="Tips">Tips</option>
                        <option value="News">News</option>
                    </select>
                </div>

                <div>
                    <label className="label">
                        <span className="label-text">Content</span>
                    </label>
                    <textarea 
                        className="textarea textarea-bordered w-full h-48"
                        value={formData.content}
                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                        required
                    />
                </div>

                <div>
                    <label className="label">
                        <span className="label-text">Tags (comma-separated)</span>
                    </label>
                    <input 
                        type="text"
                        className="input input-bordered w-full"
                        value={formData.tags}
                        onChange={(e) => setFormData({...formData, tags: e.target.value})}
                        placeholder="e.g., math, algebra, equations"
                    />
                </div>

                <button type="submit" className="btn btn-primary">
                    Create Discussion
                </button>
            </form>
        </div>
    )
}

export default NewDiscussion 