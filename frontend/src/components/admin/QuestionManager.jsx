import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import QuestionTable from '../practice/QuestionTable'
import { AuthContext } from '../../context/AuthContext'

const QuestionManager = () => {
    const { token } = useContext(AuthContext)
    const [questions, setQuestions] = useState([])
    const [filters, setFilters] = useState({
        section: '',
        difficulty: '',
        type: '',
        search: ''
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const navigate = useNavigate()

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

    const handleCreateQuestion = () => {
        navigate('/admin/question/new')
    }

    const handleEdit = (questionNumber) => {
        navigate(`/admin/question/${questionNumber}`)
    }

    const handleDelete = async (questionNumber) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            try {
                await axios.delete(`/api/questions/${questionNumber}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                // Refresh questions list
                const response = await axios.get('/api/questions', {
                    params: {
                        ...filters,
                        page: currentPage,
                        limit: 50
                    }
                })
                setQuestions(response.data.questions || [])
                setTotalPages(response.data.totalPages || 1)
            } catch (error) {
                console.error('Error deleting question:', error)
            }
        }
    }

    return (
        <QuestionTable 
            questions={questions}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            onFilterChange={(newFilters) => setFilters(newFilters)}
            showFilters={true}
            initialFilters={filters}
            showStats={false}
            showSection={true}
            customAction={handleCreateQuestion}
            showActions={true}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
    )
}

export default QuestionManager 