import { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import ActivityCalendar from '../components/ActivityCalendar'
import { AuthContext } from '../context/AuthContext'

const Practice = () => {
    const { user, token } = useContext(AuthContext)
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
    const [progress, setProgress] = useState(null)

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
                        userId: user?._id
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
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
    }, [filters, currentPage, user?._id, token])

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

    const handlePickOne = async () => {
        try {
            const { section, difficulty, type, status, search } = filters
            const response = await axios.get('/api/questions/random', {
                params: {
                    section,
                    difficulty,
                    type,
                    status,
                    search,
                    userId: user?._id
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            
            if (response.data.questionNumber) {
                window.location.href = `/question/${response.data.questionNumber}`
            } else {
                // Show error message if no questions match the filters
                alert('No questions available with the selected filters')
            }
        } catch (error) {
            console.error('Error fetching random question:', error)
            alert('Error fetching random question')
        }
    }

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const response = await axios.get('/api/dashboard', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setProgress(response.data)
            } catch (error) {
                console.error('Error fetching progress:', error)
            }
        }

        fetchProgress()
    }, [token])

    return (
        <div className="flex mt-16">

            {/* Main Section */}
            <main className="w-full md:w-3/4 p-8">
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
                <div className="bg-base-200 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <select 
                            name="section" 
                            className="select select-bordered w-full" 
                            onChange={handleFilterChange}
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
                        >
                            <option value="">All Difficulties</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                        
                        <select 
                            name="status" 
                            className="select select-bordered w-full" 
                            onChange={handleFilterChange}
                        >
                            <option value="">All Status</option>
                            <option value="Solved">Solved</option>
                            <option value="Unsolved">Unsolved</option>
                            <option value="Attempted">Attempted</option>
                        </select>
                        
                        <select 
                            name="type" 
                            className="select select-bordered w-full" 
                            onChange={handleFilterChange}
                        >
                            <option value="">All Types</option>
                            <option value="MCQ">MCQ</option>
                            <option value="Integer">Integer</option>
                        </select>

                        <div className="relative">
                            <input 
                                type="text" 
                                name="search"
                                placeholder="Search questions" 
                                className="input input-bordered w-full pr-10"
                                onChange={handleFilterChange} 
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-3 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        
                        <button 
                            className="btn btn-primary w-full" 
                            onClick={handlePickOne}
                        >
                            Pick Random
                        </button>
                    </div>
                </div>

                {/* Questions Table */}
                <div className="bg-base-100 rounded-lg shadow-lg">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr className="bg-base-200">
                                    <th className="font-bold">Number</th>
                                    <th className="font-bold">Title</th>
                                    <th className="font-bold">Difficulty</th>
                                    <th className="font-bold">Type</th>
                                    <th className="font-bold">Status</th>
                                    <th className="font-bold">Accuracy</th>
                                    <th className="font-bold">Time Spent</th>
                                </tr>
                            </thead>
                            <tbody>
                                {questions.map((question) => (
                                    <tr 
                                        key={question._id} 
                                        className="hover:bg-base-200 cursor-pointer transition-colors duration-200" 
                                        onClick={() => window.location.href = `/question/${question.questionNumber}`}
                                    >
                                        <td className="font-medium">{question.questionNumber}</td>
                                        <td>{question.title}</td>
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
                                                {question.status}
                                            </span>
                                        </td>
                                        <td className="font-medium">{question.avgAccuracy.toFixed(2)}%</td>
                                        <td className="font-medium">{question.avgTimeSpent.toFixed(2)}s</td>
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
            </main>

            {/* USER PROGRESS DASHBOARD || Aside Section (30% width placeholder) */}
            <aside className="hidden md:block w-1/4 p-4 fixed right-0 top-16 h-full overflow-y-auto bg-base-200">
                <div className="space-y-2">
                    {/* User Progress Card */}
                    <div className="card shadow-lg bg-base-100 p-2 mb-4">
                        <h2 className="text-3xl font-bold mb-2 pt-4 pl-4">Your Progress</h2>
                        {progress ? (
                            <div className="stats shadow grid grid-rows-2">
                                <div className="stat">
                                    <div className="stat-title font-bold">Questions</div>
                                    <div className="stat-value text-3xl">{progress.totalQuestionsSolved}</div>
                                    <div className="stat-desc font-semibold">solved</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title font-bold">Accuracy</div>
                                    <div className="stat-value text-3xl">{progress.averageAccuracy.toFixed(2)}</div>
                                    <div className="stat-desc font-bold">%</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title font-bold">Time Spent</div>
                                    <div className="stat-value text-3xl">{(progress.totalTimeSpent/60).toFixed(2)}</div>
                                    <div className="stat-desc font-semibold">minutes</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title font-bold">Average Time</div>
                                    <div className="stat-value text-3xl">{progress.averageTimeSpent.toFixed(2)}</div>
                                    <div className="stat-desc font-semibold">seconds</div>
                                </div>
                            </div>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>

                    {/* Activity Calendar */}
                    {user && <ActivityCalendar userId={user._id} />}
                </div>
            </aside>

        </div>
    )
}

Practice.propTypes = {
    userId: PropTypes.string,
}

export default Practice