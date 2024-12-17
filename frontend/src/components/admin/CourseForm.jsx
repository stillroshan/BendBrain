import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { XMarkIcon } from '@heroicons/react/24/outline'
import PropTypes from 'prop-types'
import { AuthContext } from '../../context/AuthContext'

const CourseForm = ({ course, onClose, onSubmit }) => {
    const { token } = useContext(AuthContext)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        examType: '',
        thumbnail: '',
        isPublished: false
    })
    const [error, setError] = useState('')

    useEffect(() => {
        if (course) {
            setFormData({
                title: course.title || '',
                description: course.description || '',
                examType: course.examType || '',
                thumbnail: course.thumbnail || '',
                isPublished: course.isPublished || false
            })
        }
    }, [course])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
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
            
            if (course) {
                await axios.put(`/api/learning/courses/${course._id}`, formData, config)
            } else {
                await axios.post('/api/learning/courses', formData, config)
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
                {course ? 'Edit Course' : 'Create New Course'}
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
                        <span className="label-text">Description</span>
                    </label>
                    <textarea 
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="textarea textarea-bordered"
                        required
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Exam Type</span>
                    </label>
                    <select 
                        name="examType"
                        value={formData.examType}
                        onChange={handleChange}
                        className="select select-bordered"
                        required
                    >
                        <option value="">Select Exam Type</option>
                        <option value="CAT">CAT</option>
                        <option value="GMAT">GMAT</option>
                        <option value="GRE">GRE</option>
                        <option value="SAT">SAT</option>
                        <option value="UPSC">UPSC</option>
                        <option value="RRB">RRB</option>
                        <option value="SSC">SSC</option>
                        <option value="BANK PO">BANK PO</option>
                    </select>
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Thumbnail URL</span>
                    </label>
                    <input 
                        type="url"
                        name="thumbnail"
                        value={formData.thumbnail}
                        onChange={handleChange}
                        className="input input-bordered"
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
                        {course ? 'Update' : 'Create'}
                    </button>
                </div>
            </form>
        </div>
    )
}

CourseForm.propTypes = {
    course: PropTypes.shape({
        _id: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        examType: PropTypes.string,
        thumbnail: PropTypes.string,
        isPublished: PropTypes.bool
    }),
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
}

export default CourseForm
