import PropTypes from 'prop-types'
import { useState } from 'react'
import { PlusIcon, BookmarkIcon } from '@heroicons/react/24/outline'
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid'
import CreateListModal from './CreateListModal'

const ListDrawer = ({ lists, selectedListId, onListSelect, onRefresh }) => {
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    const filteredLists = lists.filter(list => 
        list.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-base-300">
                <h2 className="text-xl font-bold mb-4">Question Lists</h2>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search lists..."
                        className="input input-bordered input-sm flex-1"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <PlusIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Lists */}
            <div className="flex-1 overflow-y-auto">
                {filteredLists.map((list) => (
                    <button
                        key={list._id}
                        className={`w-full p-4 text-left hover:bg-base-300 flex items-center gap-3
                        ${selectedListId === list._id ? 'bg-base-300' : ''}`}
                        onClick={() => onListSelect(list._id)}
                    >
                        {list.isFavorites ? (
                            <BookmarkSolidIcon className="w-5 h-5 text-primary" />
                        ) : (
                            <BookmarkIcon className="w-5 h-5" />
                        )}
                        <div className="flex-1 truncate">
                            <h3 className="font-medium truncate">{list.title}</h3>
                            <p className="text-sm text-base-content/70">
                                {list.questions?.length || 0} questions
                            </p>
                        </div>
                    </button>
                ))}
            </div>

            {/* Create List Modal */}
            <CreateListModal 
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={() => {
                    setShowCreateModal(false)
                    onRefresh()
                }}
            />
        </div>
    )
}

ListDrawer.propTypes = {
    lists: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        isFavorites: PropTypes.bool,
        questions: PropTypes.array
    })).isRequired,
    selectedListId: PropTypes.string,
    onListSelect: PropTypes.func.isRequired,
    onRefresh: PropTypes.func.isRequired
}

export default ListDrawer