import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import PropTypes from 'prop-types'

const ForkListModal = ({ onClose, onFork }) => {
    const [title, setTitle] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        onFork(title)
    }

    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <button 
                    className="btn btn-sm btn-circle absolute right-2 top-2"
                    onClick={onClose}
                >
                    <XMarkIcon className="h-5 w-5" />
                </button>

                <h3 className="font-bold text-lg mb-4">Fork List</h3>

                <form onSubmit={handleSubmit}>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">New List Title</span>
                        </label>
                        <input 
                            type="text"
                            className="input input-bordered"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="Enter a title for your forked list"
                        />
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
                            disabled={!title.trim()}
                        >
                            Create Fork
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

ForkListModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onFork: PropTypes.func.isRequired
}

export default ForkListModal 