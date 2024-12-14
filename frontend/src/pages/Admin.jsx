import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Admin = () => {
    const [questions, setQuestions] = useState([])
    const [filters, setFilters] = useState({
        section: '',
        difficulty: '',
        type: '',
        search: ''
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    // fetch questions based on filters
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const { section, difficulty, type, search } = filters
                const response = await axios.get('/api/questions', {
                    params: {
                        section,
                        difficulty,
                        type,
                        search,
                        page: currentPage,
                        limit: 50
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
    }, [filters, currentPage])

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
        <div className="flex mt-4">

            {/* Main Section */}
            <main className="w-full md:w-2/3 p-4">
                <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>

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

                    {/* Create Question Button */}
                    <Link to="/admin/question/new" className="btn btn-primary">
                        Create Question
                    </Link>
                </div>

                {/* Questions Table */}
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Number</th>
                                <th>Title</th>
                                <th>Section</th>
                                <th>Difficulty</th>
                                <th>Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map((question) => (
                                <tr 
                                    key={question._id} 
                                    className="hover cursor-pointer" 
                                    onClick={() => window.location.href = `/admin/question/${question.questionNumber}`}
                                >
                                    <td>{question.questionNumber}</td>
                                    <td>{question.title}</td>
                                    <td>{question.section}</td>
                                    <td>{question.difficulty}</td>
                                    <td>{question.type}</td>
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

export default Admin