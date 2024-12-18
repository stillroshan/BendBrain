import { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import ActivityCalendar from '../../components/practice/ActivityCalendar'
import { AuthContext } from '../../context/AuthContext'
import QuestionTable from '../../components/practice/QuestionTable'
import UserProgressCard from '../../components/practice/UserProgressCard'

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
    const [isAsideVisible, setIsAsideVisible] = useState(window.innerWidth >= 1440)

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
                const response = await axios.get('/api/dashboard/progress', {
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

    useEffect(() => {
        const checkWidth = () => {
            setIsAsideVisible(window.innerWidth >= 1440)
        }

        window.addEventListener('resize', checkWidth)
        checkWidth()

        return () => window.removeEventListener('resize', checkWidth)
    }, [])

    return (
        <div className="flex mt-12">

            {/* Main Section */}
            <main className={`w-full ${isAsideVisible ? 'md:w-3/4' : ''} p-8`}>
                <div className="mb-8 border-b border-base-300 pb-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">
                                Practice Questions
                            </h1>
                            <p className="text-base-content/70">
                                Master your skills with our curated collection of practice problems
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-3 bg-base-200 px-4 py-2 rounded-lg">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-success"></div>
                                <span className="text-sm font-medium">Solved: {progress?.totalQuestionsSolved || 0}</span>
                            </div>
                            <div className="divider divider-horizontal mx-1"></div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-warning"></div>
                                <span className="text-sm font-medium">Attempted: {progress?.totalQuestionsAttempted || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>

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

                {/* Questions Table */}
                <QuestionTable 
                    questions={questions}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                    onFilterChange={(newFilters) => setFilters(newFilters)}
                    showFilters={true}
                    initialFilters={filters}
                    onPickRandom={handlePickOne}
                    showStats={true}
                    showSection={false}
                    showStatus={true}
                />
            </main>

            {/* Aside Section - Updated visibility */}
            {isAsideVisible && (
                <aside className="hidden md:block w-1/4 p-6 bg-base-100">
                    <div className="sticky top-20 space-y-4 mt-2">
                        <UserProgressCard progress={progress} />
                        <ActivityCalendar userId={user?._id} />
                    </div>
                </aside>
            )}

        </div>
    )
}

Practice.propTypes = {
    userId: PropTypes.string,
}

export default Practice