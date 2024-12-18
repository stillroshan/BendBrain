import PropTypes from 'prop-types'
import { useState } from 'react'

const QuestionTable = ({ 
    questions, 
    totalPages, 
    onPageChange, 
    onFilterChange,
    showFilters = true,
    initialFilters = {
        section: '',
        difficulty: '',
        status: '',
        type: '',
        search: ''
    },
    onPickRandom = null,
    showStats = true,
    showSection = false,
    customAction = null,
    showActions = false,
    onEdit = null,
    onDelete = null
}) => {
    const [filters, setFilters] = useState(initialFilters)
    const [currentPage, setCurrentPage] = useState(1)

    const handleFilterChange = (e) => {
        const { name, value } = e.target
        const newFilters = {
            ...filters,
            [name]: value
        }
        setFilters(newFilters)
        setCurrentPage(1)
        onFilterChange(newFilters)
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
        onPageChange(page)
    }

    return (
        <div>
            {/* Filter Buttons */}
            {showFilters && (
                <div className="bg-base-200 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <select 
                            name="section" 
                            className="select select-bordered w-full" 
                            onChange={handleFilterChange}
                            value={filters.section}
                        >
                            <option value="">All Sections</option>
                            <option value="Numerical Ability">Numerical Ability</option>
                            <option value="Verbal Reasoning">Verbal Reasoning</option>
                            <option value="Non-verbal Reasoning">Non-verbal Reasoning</option>
                            <option value="Verbal Ability">Verbal Ability</option>
                            <option value="Quantitative Aptitude">Quantitative Aptitude</option>
                            <option value="Data Interpretation">Data Interpretation</option>
                        </select>

                        <select 
                            name="difficulty" 
                            className="select select-bordered w-full" 
                            onChange={handleFilterChange}
                            value={filters.difficulty}
                        >
                            <option value="">All Difficulties</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>

                        <select 
                            name="type" 
                            className="select select-bordered w-full" 
                            onChange={handleFilterChange}
                            value={filters.type}
                        >
                            <option value="">All Types</option>
                            <option value="MCQ">MCQ</option>
                            <option value="Integer">Integer</option>
                        </select>
                        
                        {!showSection && (
                            <select 
                                name="status" 
                                className="select select-bordered w-full" 
                                onChange={handleFilterChange}
                                value={filters.status}
                            >
                                <option value="">All Status</option>
                                <option value="Solved">Solved</option>
                                <option value="Unsolved">Unsolved</option>
                                <option value="Attempted">Attempted</option>
                            </select>
                        )}

                        <div className={`relative ${showSection ? 'lg:col-span-2' : ''}`}>
                            <input 
                                type="text" 
                                name="search"
                                placeholder="Search questions" 
                                className="input input-bordered w-full pr-10"
                                onChange={handleFilterChange}
                                value={filters.search}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-3 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        {(onPickRandom || customAction) && (
                            <button 
                                className="btn btn-primary w-full" 
                                onClick={onPickRandom || customAction}
                            >
                                {onPickRandom ? 'Pick Random' : 'Create Question'}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Questions Table */}
            <div className="bg-base-100 rounded-lg shadow-lg">
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr className="bg-base-200">
                                <th className="font-bold">Number</th>
                                <th className="font-bold">Title</th>
                                {showSection && (
                                    <th className="font-bold">Section</th>
                                )}
                                <th className="font-bold">Difficulty</th>
                                <th className="font-bold">Type</th>
                                {!showSection && (
                                    <th className="font-bold">Status</th>
                                )}
                                {showStats && (
                                    <>
                                        <th className="font-bold">Accuracy</th>
                                        <th className="font-bold">Time Spent</th>
                                    </>
                                )}
                                {showActions && (
                                    <th className="font-bold text-center">Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map((question) => (
                                <tr 
                                    key={question._id} 
                                    className="hover:bg-base-200 cursor-pointer transition-colors duration-200" 
                                    onClick={(e) => {
                                        if (!e.target.closest('.action-buttons')) {
                                            window.location.href = `/question/${question.questionNumber}`
                                        }
                                    }}
                                >
                                    <td className="font-medium">{question.questionNumber}</td>
                                    <td>{question.title}</td>
                                    {showSection && (
                                        <td>{question.section}</td>
                                    )}
                                    <td>
                                        <span className={`font-medium ${
                                            question.difficulty === 'Hard' ? 'text-error' :
                                            question.difficulty === 'Medium' ? 'text-warning' :
                                            'text-success'
                                        }`}>
                                            {question.difficulty}
                                        </span>
                                    </td>
                                    <td>{question.type}</td>
                                    {!showSection && (
                                        <td>
                                            <span className={`badge ${
                                                question.status === 'Solved' ? 'badge-success' :
                                                question.status === 'Attempted' ? 'badge-warning' :
                                                'badge-ghost'
                                            } badge-sm`}>
                                                {question.status}
                                            </span>
                                        </td>
                                    )}
                                    {showStats && (
                                        <>
                                            <td className="font-medium">{question.avgAccuracy?.toFixed(2)}%</td>
                                            <td className="font-medium">{question.avgTimeSpent?.toFixed(2)}s</td>
                                        </>
                                    )}
                                    {showActions && (
                                        <td>
                                            <div className="flex items-center justify-center gap-2">
                                                <button 
                                                    className="btn btn-ghost btn-sm"
                                                    onClick={() => onEdit?.(question.questionNumber)}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                    </svg>
                                                </button>
                                                <button 
                                                    className="btn btn-ghost btn-sm text-error"
                                                    onClick={() => onDelete?.(question.questionNumber)}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
                <button
                    className="btn btn-outline mx-1"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                {[...Array(totalPages).keys()].map((page) => (
                    <button
                        key={page + 1}
                        className={`btn btn-outline mx-1 ${currentPage === page + 1 ? 'btn-active' : ''}`}
                        onClick={() => handlePageChange(page + 1)}
                    >
                        {page + 1}
                    </button>
                ))}
                <button
                    className="btn btn-outline mx-1"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    )
}

QuestionTable.propTypes = {
    questions: PropTypes.array.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    showFilters: PropTypes.bool,
    initialFilters: PropTypes.shape({
        section: PropTypes.string,
        difficulty: PropTypes.string,
        status: PropTypes.string,
        type: PropTypes.string,
        search: PropTypes.string
    }),
    onPickRandom: PropTypes.func,
    showStats: PropTypes.bool,
    showSection: PropTypes.bool,
    customAction: PropTypes.func,
    showActions: PropTypes.bool,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func
}

export default QuestionTable
