import PropTypes from 'prop-types'
import { useState } from 'react'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'

const ListQuestionTable = ({ 
    questions,
    totalPages,
    onPageChange,
    onFilterChange,
    showFilters = true,
    initialFilters = {
        section: '',
        difficulty: '',
        type: '',
        status: '',
        search: ''
    },
    showSection = true,
    onAdd = null,
    onRemove = null,
    showOrder = false,
    showActions = false,
    onPickRandom = null
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
        onFilterChange(newFilters)
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
        onPageChange(page)
    }

    return (
        <div>
            {showFilters && (
                <div className="bg-base-200 rounded-lg p-4 mb-6">
                    <div className="flex flex-wrap items-center gap-2">
                        <select 
                            name="section"
                            value={filters.section}
                            onChange={handleFilterChange}
                            className="select select-bordered w-32"
                        >
                            <option value="">All Sections</option>
                            <option value="Numerical Ability">Numerical Ability</option>
                            <option value="Verbal Reasoning">Verbal Reasoning</option>
                            <option value="Non-Verbal Reasoning">Non-Verbal Reasoning</option>
                            <option value="Verbal Ability">Verbal Ability</option>
                            <option value="Quantitative Aptitude">Quantitative Aptitude</option>
                            <option value="Data Interpretation">Data Interpretation</option>
                        </select>

                        <select 
                            name="difficulty"
                            value={filters.difficulty}
                            onChange={handleFilterChange}
                            className="select select-bordered w-32"
                        >
                            <option value="">All Difficulties</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>

                        <select 
                            name="type"
                            value={filters.type}
                            onChange={handleFilterChange}
                            className="select select-bordered w-32"
                        >
                            <option value="">All Types</option>
                            <option value="MCQ">MCQ</option>
                            <option value="Integer">Integer</option>
                        </select>

                        <select 
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            className="select select-bordered w-32"
                        >
                            <option value="">All Status</option>
                            <option value="Solved">Solved</option>
                            <option value="Unsolved">Unsolved</option>
                            <option value="Attempted">Attempted</option>
                        </select>

                        <div className="relative flex-1 min-w-[180px]">
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

                        {onPickRandom && (
                            <button 
                                className="btn btn-primary w-32"
                                onClick={onPickRandom}
                            >
                                Pick Random
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div className="bg-base-100 rounded-lg shadow-lg">
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr className="bg-base-200">
                                {showOrder && <th className="font-bold">Order</th>}
                                <th className="font-bold">Number</th>
                                <th className="font-bold">Title</th>
                                {showSection && (
                                    <th className="font-bold">Section</th>
                                )}
                                <th className="font-bold">Difficulty</th>
                                <th className="font-bold">Type</th>
                                <th className="font-bold">Status</th>
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
                                    {showOrder && <td>{question.order}</td>}
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
                                    <td>
                                        <span className={`badge ${
                                            question.status === 'Solved' ? 'badge-success' :
                                            question.status === 'Attempted' ? 'badge-warning' :
                                            'badge-ghost'
                                        } badge-sm`}>
                                            {question.status || 'Unsolved'}
                                        </span>
                                    </td>
                                    {showActions && (
                                        <td className="action-buttons">
                                            <div className="flex items-center justify-center gap-2">
                                                {onAdd && (
                                                    <button
                                                        className="btn btn-ghost btn-sm text-primary"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onAdd(question);
                                                        }}
                                                    >
                                                        <PlusIcon className="h-4 w-4" />
                                                    </button>
                                                )}
                                                {onRemove && (
                                                    <button
                                                        className="btn btn-ghost btn-sm text-error"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onRemove(question);
                                                        }}
                                                    >
                                                        <XMarkIcon className="h-4 w-4" />
                                                    </button>
                                                )}
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

ListQuestionTable.propTypes = {
    questions: PropTypes.array.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    showFilters: PropTypes.bool,
    initialFilters: PropTypes.object,
    showSection: PropTypes.bool,
    onAdd: PropTypes.func,
    onRemove: PropTypes.func,
    showOrder: PropTypes.bool,
    showActions: PropTypes.bool,
    onPickRandom: PropTypes.func
}

export default ListQuestionTable 