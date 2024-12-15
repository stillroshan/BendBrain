import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { XMarkIcon } from '@heroicons/react/24/outline'
import MDEditor from '@uiw/react-md-editor'
import PropTypes from 'prop-types'
import { AuthContext } from '../../context/AuthContext'

const TopicForm = ({ topic, subjectId, onClose, onSubmit }) => {
    const { token } = useContext(AuthContext)
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        order: 0,
        isPublished: false
    })
    const [error, setError] = useState('')

    useEffect(() => {
        if (topic) {
            setFormData({
                title: topic.title || '',
                content: topic.content || '',
                order: topic.order || 0,
                isPublished: topic.isPublished || false
            })
        }
    }, [topic])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleContentChange = (value) => {
        setFormData(prev => ({
            ...prev,
            content: value || ''
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            
            if (topic) {
                await axios.put(`/api/learning/topics/${topic._id}`, formData, config)
            } else {
                await axios.post('/api/learning/topics', { ...formData, subject: subjectId }, config)
            }
            onSubmit()
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred')
        }
    }

    return (
        <div className="relative">
            <button 
                onClick={onClose}
                className="absolute right-0 top-0 btn btn-ghost btn-sm"
            >
                <XMarkIcon className="h-5 w-5" />
            </button>

            <h2 className="text-2xl font-bold mb-6">
                {topic ? 'Edit Topic' : 'Create New Topic'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="alert alert-error">{error}</div>
                )}

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Title</span>
                    </label>
                    <input 
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="input input-bordered"
                        required
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Content</span>
                    </label>
                    <div data-color-mode="light">
                        <MDEditor
                            value={formData.content}
                            onChange={handleContentChange}
                            preview="edit"
                            height={400}
                            className="mb-4"
                        />
                    </div>
                    <p className="text-sm text-base-content/70 mt-2">
                        Supports Markdown and LaTeX math expressions (enclosed in $ or $$)
                    </p>
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Order</span>
                    </label>
                    <input 
                        type="number"
                        name="order"
                        value={formData.order}
                        onChange={handleChange}
                        className="input input-bordered"
                        min="0"
                        required
                    />
                </div>

                <div className="form-control">
                    <label className="label cursor-pointer">
                        <span className="label-text">Published</span>
                        <input 
                            type="checkbox"
                            name="isPublished"
                            checked={formData.isPublished}
                            onChange={handleChange}
                            className="checkbox"
                        />
                    </label>
                </div>

                <div className="flex justify-end gap-2">
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="btn btn-ghost"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        className="btn btn-primary"
                    >
                        {topic ? 'Update' : 'Create'}
                    </button>
                </div>
            </form>
        </div>
    )
}

TopicForm.propTypes = {
    topic: PropTypes.shape({
        _id: PropTypes.string,
        title: PropTypes.string,
        content: PropTypes.string,
        order: PropTypes.number,
        isPublished: PropTypes.bool
    }),
    subjectId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
}

export default TopicForm
