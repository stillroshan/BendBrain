import PropTypes from 'prop-types'
import { useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import { XMarkIcon } from '@heroicons/react/24/outline'

const CreateListModal = ({ isOpen, onClose, onSuccess }) => {
    const { token } = useContext(AuthContext)
    const [formData, setFormData] = useState({
        title: '',
        visibility: 'private',
        questions: []
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await axios.post('/api/lists', formData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            onSuccess()
            setFormData({ title: '', visibility: 'private', questions: [] })
        } catch (error) {
            setError(error.response?.data?.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <button 
                    className="btn btn-sm btn-circle absolute right-2 top-2"
                    onClick={onClose}
                >
                    <XMarkIcon className="w-5 h-5" />
                </button>
                
                <h3 className="font-bold text-lg mb-4">Create New List</h3>
                
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="alert alert-error mb-4">
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text">Title</span>
                        </label>
                        <input 
                            type="text"
                            className="input input-bordered"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                title: e.target.value
                            }))}
                            required
                        />
                    </div>

                    <div className="form-control mb-6">
                        <label className="label">
                            <span className="label-text">Visibility</span>
                        </label>
                        <select 
                            className="select select-bordered"
                            value={formData.visibility}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                visibility: e.target.value
                            }))}
                        >
                            <option value="private">Private</option>
                            <option value="public">Public</option>
                        </select>
                    </div>

                    <div className="modal-action">
                        <button 
                            type="button" 
                            className="btn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="loading loading-spinner"></span>
                            ) : (
                                'Create List'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

CreateListModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired
}

export default CreateListModal