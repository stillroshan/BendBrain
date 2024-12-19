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
    showActions = false
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
            {showFilters && (
                <div className="flex flex-wrap gap-2 mb-4">
                    <div className="form-control">
                        <select 
                            name="section"
                            value={filters.section}
                            onChange={handleFilterChange}
                            className="select select-bordered"
                        >
                            <option value="">All Sections</option>
                            <option value="Numerical Ability">Numerical Ability</option>
                            <option value="Verbal Reasoning">Verbal Reasoning</option>
                            <option value="Non-Verbal Reasoning">Non-Verbal Reasoning</option>
                            <option value="Verbal Ability">Verbal Ability</option>
                            <option value="Quantitative Aptitude">Quantitative Aptitude</option>
                            <option value="Data Interpretation">Data Interpretation</option>
                        </select>
                    </div>

                    <div className="form-control">
                        <select 
                            name="difficulty"
                            value={filters.difficulty}
                            onChange={handleFilterChange}
                            className="select select-bordered"
                        >
                            <option value="">All Difficulties</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                    <div className="form-control">
                        <select 
                            name="type"
                            value={filters.type}
                            onChange={handleFilterChange}
                            className="select select-bordered"
                        >
                            <option value="">All Types</option>
                            <option value="MCQ">MCQ</option>
                            <option value="Integer">Integer</option>
                        </select>
                    </div>
                    <div className="form-control">
                        <select 
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            className="select select-bordered"
                        >
                            <option value="">All Status</option>
                            <option value="Solved">Solved</option>
                            <option value="Attempted">Attempted</option>
                            <option value="Todo">Unsolved</option>
                        </select>
                    </div>
                    <div className="form-control flex-1 max-w-xs">
                        <input
                            type="text"
                            name="search"
                            placeholder="Search questions..."
                            value={filters.search}
                            onChange={handleFilterChange}
                            className="input input-bordered w-full"
                        />
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
                                            {question.status || 'Todo'}
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
    showActions: PropTypes.bool
}

export default ListQuestionTable 