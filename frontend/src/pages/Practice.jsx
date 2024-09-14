import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

const Practice = ({ userId }) => {
    const [questions, setQuestions] = useState([])
    const [filters, setFilters] = useState({
        section: '',
        difficulty: '',
        status: '',
        type: '',
        search: ''
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    // fetch questions based on filters
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const { section, difficulty, type, status, search } = filters
                const response = await axios.get('/api/questions', {
                    params: {
                        section,
                        difficulty,
                        type,
                        status,
                        search,
                        page: currentPage,
                        limit: 50,
                        userId
                    }
                })
                setQuestions(response.data.questions || [])
                setTotalPages(response.data.totalPages || 1)
            } catch (error) {
                console.error('Error fetching questions:', error)
                setQuestions([])
            }
        }

        fetchQuestions()
    }, [filters, currentPage, userId])

    const handleFilterChange = (e) => {
        const { name, value } = e.target
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value
        }))
        setCurrentPage(1)
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    return (
        <div className="flex">

            {/* Main Section */}
            <main className="w-full md:w-2/3 p-4">
                <h1 className="text-3xl font-bold mb-4">Practice</h1>

                {/* Card Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div className="card shadow-lg bg-base-100 p-4">
                        <h2 className="text-xl font-bold">Numerical Ability</h2>
                        <p className="mt-2">Practice questions on Numerical Ability</p>
                    </div>

                    <div className="card shadow-lg bg-base-100 p-4">
                        <h2 className="text-xl font-bold">Verbal Reasoning</h2>
                        <p className="mt-2">Practice questions on Verbal Reasoning</p>
                    </div>

                    <div className="card shadow-lg bg-base-100 p-4">
                        <h2 className="text-xl font-bold">Non-verbal Reasoning</h2>
                        <p className="mt-2">Practice questions on Non-verbal Ability</p>
                    </div>

                    <div className="card shadow-lg bg-base-100 p-4">
                        <h2 className="text-xl font-bold">Verbal Ability</h2>
                        <p className="mt-2">Practice questions on Verbal Ability</p>
                    </div>

                    <div className="card shadow-lg bg-base-100 p-4">
                        <h2 className="text-xl font-bold">Quantitative Aptitude</h2>
                        <p className="mt-2">Practice questions on Quantitative Aptitude</p>
                    </div>

                    <div className="card shadow-lg bg-base-100 p-4">
                        <h2 className="text-xl font-bold">Data Interpretation</h2>
                        <p className="mt-2">Practice questions on Data Interpretation</p>
                    </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex items-center mb-4 space-x-4">
                    {/* Section Dropdown */}
                    <select name="section" className="select select-bordered" onChange={handleFilterChange}>
                        <option value="">Section</option>
                        <option value="Numerical Ability">Numerical Ability</option>
                        <option value="Verbal Reasoning">Verbal Reasoning</option>
                        <option value="Non-verbal Reasoning">Non-verbal Reasoning</option>
                        <option value="Verbal Ability">Verbal Ability</option>
                        <option value="Quantitative Aptitude">Quantitiative Aptitude</option>
                        <option value="Data Interpretation">Data Interpretation</option>
                    </select>

                    {/* Difficulty Dropdown */}
                    <select name="difficulty" className="select select-bordered" onChange={handleFilterChange}>
                        <option value="">Difficulty</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                    
                    {/* Status Dropdown */}
                    <select name="status" className="select select-bordered" onChange={handleFilterChange}>
                        <option value="">Status</option>
                        <option value="Solved">Solved</option>
                        <option value="Unsolved">Unsolved</option>
                        <option value="Attempted">Attempted</option>
                    </select>
                    
                    {/* Type Dropdown */}
                    <select name="type" className="select select-bordered" onChange={handleFilterChange}>
                        <option value="">Type</option>
                        <option value="MCQ">MCQ</option>
                        <option value="Integer">Integer</option>
                    </select>

                    {/* Search Bar */}
                    <input 
                        type="text" 
                        name="search"
                        placeholder="Search questions" 
                        className="input input-bordered flex-grow"
                        onChange={handleFilterChange} 
                    />
                    
                    {/* Random Button */}
                    <button className="btn btn-primary">Pick One</button>
                </div>

                {/* Questions Table */}
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Number</th>
                                <th>Title</th>
                                <th>Difficulty</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Accuracy</th>
                                <th>Time Spent</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map((question) => (
                                <tr 
                                    key={question._id} 
                                    className="hover cursor-pointer" 
                                    onClick={() => window.location.href = `/question/${question.questionNumber}`}
                                >
                                    <td>{question.questionNumber}</td>
                                    <td>{question.title}</td>
                                    <td>{question.difficulty}</td>
                                    <td>{question.type}</td>
                                    <td>{question.status}</td>
                                    <td>{question.avgAccuracy.toFixed(2)} %</td>
                                    <td>{question.avgTimeSpent.toFixed(2)} s</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
            </main>

            {/* Aside Section (30% width placeholder) */}
            <aside className="w-1/3 p-4">
                {/* to be implemented later */}
            </aside>

        </div>
    )
}

Practice.propTypes = {
    userId: PropTypes.string,
}

export default Practice