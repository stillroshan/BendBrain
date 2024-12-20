import { useState } from 'react'
import { 
    PencilSquareIcon, 
    TrashIcon, 
    ShareIcon,
    BookmarkIcon,
    DocumentDuplicateIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline'
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid'
import ListQuestionTable from './ListQuestionTable'
import PropTypes from 'prop-types'

const ListContent = ({ 
    list, 
    isDrawerOpen, 
    onToggleDrawer, 
    onEdit, 
    onDelete, 
    onFork, 
    onToggleSave,
    isCreator,
    onPageChange
}) => {
    const [filters, setFilters] = useState({
        section: '',
        difficulty: '',
        type: '',
        status: '',
        search: ''
    })
    const [showShareTooltip, setShowShareTooltip] = useState(false)

    // Filter questions based on current filters
    const filteredQuestions = list.questions.filter(q => {
        const question = q.question
        return (
            (!filters.section || question.section === filters.section) &&
            (!filters.difficulty || question.difficulty === filters.difficulty) &&
            (!filters.type || question.type === filters.type) &&
            (!filters.status || question.status === filters.status) &&
            (!filters.search || 
                question.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                question.questionNumber.toString().includes(filters.search))
        )
    }).map(q => ({
        ...q.question,
        order: q.order
    }))

    const handleShare = () => {
        const url = window.location.href
        navigator.clipboard.writeText(url)
        setShowShareTooltip(true)
        setTimeout(() => setShowShareTooltip(false), 2000)
    }

    const handlePickRandom = () => {
        const filteredQuestions = list.questions.filter(q => {
            const question = q.question
            return (
                (!filters.section || question.section === filters.section) &&
                (!filters.difficulty || question.difficulty === filters.difficulty) &&
                (!filters.type || question.type === filters.type) &&
                (!filters.status || question.status === filters.status) &&
                (!filters.search || 
                    question.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                    question.questionNumber.toString().includes(filters.search))
            )
        })

        if (filteredQuestions.length === 0) {
            alert('No questions available with the selected filters')
            return
        }

        const randomIndex = Math.floor(Math.random() * filteredQuestions.length)
        const randomQuestion = filteredQuestions[randomIndex].question
        window.location.href = `/question/${randomQuestion.questionNumber}`
    }

    return (
        <div className={`
            transition-all duration-300 min-h-[calc(100vh-4rem)] bg-base-100
            ${isDrawerOpen ? 'px-8' : 'px-6'}
        `}>
            <div className={`
                max-w-7xl mx-auto
                ${isDrawerOpen ? 'py-8' : 'py-6'}
            `}>
                {/* List Header */}
                <div className="flex justify-between items-center h-10 mb-8">
                    <div className="flex items-center gap-4">
                        {!isDrawerOpen && (
                            <button
                                className="btn btn-square btn-ghost"
                                onClick={onToggleDrawer}
                            >
                                <ChevronRightIcon className="h-5 w-5" />
                            </button>
                        )}
                        <div>
                            <h2 className="text-2xl font-bold">{list.title}</h2>
                            <p className="text-base-content/70">
                                Created by {list.creator.username}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {(isCreator || list.visibility === 'public') && (
                            <>
                                <button 
                                    className="btn btn-ghost btn-sm"
                                    onClick={onEdit}
                                    disabled={list.isFavorites || !isCreator}
                                >
                                    <PencilSquareIcon className="h-5 w-5" />
                                </button>
                                <button 
                                    className="btn btn-ghost btn-sm text-error"
                                    onClick={onDelete}
                                    disabled={list.isFavorites || !isCreator}
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </>
                        )}
                        {!isCreator && (
                            <button 
                                className="btn btn-ghost btn-sm"
                                onClick={onToggleSave}
                            >
                                {list.savedBy?.some(user => 
                                    (typeof user === 'string' ? user : user._id) === user?._id
                                ) ? (
                                    <BookmarkSolidIcon className="h-5 w-5 text-primary" />
                                ) : (
                                    <BookmarkIcon className="h-5 w-5" />
                                )}
                            </button>
                        )}
                        {(isCreator || list.visibility === 'public') && (
                            <button 
                                className="btn btn-ghost btn-sm"
                                onClick={onFork}
                            >
                                <DocumentDuplicateIcon className="h-5 w-5" />
                            </button>
                        )}
                        <div className="relative">
                            <button 
                                className="btn btn-ghost btn-sm"
                                onClick={handleShare}
                            >
                                <ShareIcon className="h-5 w-5" />
                            </button>
                            {showShareTooltip && (
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-base-300 rounded text-sm whitespace-nowrap">
                                    Link copied!
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Questions Table */}
                <div className="bg-base-100 rounded-lg">
                    <ListQuestionTable 
                        questions={filteredQuestions}
                        totalPages={Math.ceil(filteredQuestions.length / 50)}
                        onPageChange={onPageChange}
                        onFilterChange={setFilters}
                        showFilters={true}
                        initialFilters={filters}
                        showSection={true}
                        showOrder={true}
                        showActions={false}
                        onPickRandom={handlePickRandom}
                    />
                </div>
            </div>
        </div>
    )
}

ListContent.propTypes = {
    list: PropTypes.shape({
        title: PropTypes.string.isRequired,
        creator: PropTypes.shape({
            _id: PropTypes.string.isRequired,
            username: PropTypes.string.isRequired
        }).isRequired,
        visibility: PropTypes.string.isRequired,
        savedBy: PropTypes.arrayOf(PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                _id: PropTypes.string.isRequired,
                username: PropTypes.string
            })
        ])),
        questions: PropTypes.arrayOf(PropTypes.shape({
            question: PropTypes.object.isRequired,
            order: PropTypes.number.isRequired
        })).isRequired,
        isFavorites: PropTypes.bool
    }).isRequired,
    isDrawerOpen: PropTypes.bool.isRequired,
    onToggleDrawer: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onFork: PropTypes.func.isRequired,
    onToggleSave: PropTypes.func.isRequired,
    isCreator: PropTypes.bool.isRequired,
    onPageChange: PropTypes.func.isRequired
}

export default ListContent 