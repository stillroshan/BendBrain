import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import QuestionTable from '../practice/QuestionTable'

const QuestionManager = () => {
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
        />
    )
}

export default QuestionManager 