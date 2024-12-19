import PropTypes from 'prop-types'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
    ChevronLeftIcon, 
    ChevronRightIcon, 
    MagnifyingGlassIcon,
    StarIcon,
    LockClosedIcon,
    BookmarkIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

const ListDrawer = ({ 
    lists, 
    selectedListId, 
    isOpen, 
    onToggle, 
    onCreateClick,
    searchQuery,
    onSearchChange 
}) => {
    // Filter and sort lists
    const filteredLists = lists
        .filter(list => 
            list.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            // Favorites first
            if (a.isFavorites && !b.isFavorites) return -1
            if (!a.isFavorites && b.isFavorites) return 1
            // Then by creation date
            return new Date(b.createdAt) - new Date(a.createdAt)
        })

    return (
        <div className={`
            fixed left-0 top-16 h-[calc(100vh-4rem)] 
            transition-all duration-300 ease-in-out
            border-r border-base-300
            ${isOpen ? 'w-80' : 'w-0'}
            z-20 bg-base-200
        `}>
            {/* Drawer Content */}
            <div className={`
                h-full w-80 overflow-hidden transition-all duration-300
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                relative
            `}>
                <div className="h-full flex flex-col p-4">
                    {/* Header */}
                    <div className="flex justify-between items-center h-14 mb-6">
                        <h2 className="text-3xl font-bold">Lists</h2>
                        <div className="flex items-center gap-2">
                            <button 
                                className="btn btn-primary"
                                onClick={onCreateClick}
                            >
                                Create
                            </button>
                            <button
                                className="btn btn-square btn-ghost"
                                onClick={onToggle}
                            >
                                <ChevronLeftIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative mb-4">
                        <input
                            type="text"
                            placeholder="Search lists..."
                            className="input input-bordered w-full pr-10"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                        <MagnifyingGlassIcon className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                    </div>

                    {/* Lists */}
                    <div className="overflow-y-auto flex-1">
                        <div className="space-y-2">
                            {filteredLists.map(list => (
                                <Link
                                    key={list._id}
                                    to={`/lists/${list._id}`}
                                    className={`
                                        block p-3 rounded-lg transition-colors
                                        hover:bg-base-300
                                        ${selectedListId === list._id ? 'bg-base-300' : 'bg-base-100'}
                                    `}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            {list.isFavorites ? (
                                                <StarSolidIcon className="h-5 w-5 text-warning flex-shrink-0" />
                                            ) : list.visibility === 'private' ? (
                                                <LockClosedIcon className="h-5 w-5 flex-shrink-0" />
                                            ) : (
                                                <StarIcon className="h-5 w-5 flex-shrink-0" />
                                            )}
                                            <span className="truncate">{list.title}</span>
                                        </div>
                                        {list.savedBy?.includes(list.creator) && (
                                            <BookmarkIcon className="h-5 w-5 flex-shrink-0 text-primary" />
                                        )}
                                    </div>
                                    <div className="mt-1 text-sm text-base-content/70">
                                        {list.questions?.length || 0} questions
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

ListDrawer.propTypes = {
    lists: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        isFavorites: PropTypes.bool,
        visibility: PropTypes.string,
        savedBy: PropTypes.arrayOf(PropTypes.string),
        creator: PropTypes.shape({
            _id: PropTypes.string.isRequired,
            username: PropTypes.string.isRequired
        }),
        questions: PropTypes.array,
        createdAt: PropTypes.string
    })).isRequired,
    selectedListId: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    onCreateClick: PropTypes.func.isRequired,
    searchQuery: PropTypes.string.isRequired,
    onSearchChange: PropTypes.func.isRequired
}

export default ListDrawer
