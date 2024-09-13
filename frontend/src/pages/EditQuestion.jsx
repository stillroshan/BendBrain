import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'

const EditQuestion = () => {
    const { questionId } = useParams()
    const navigate = useNavigate()
    const { token, user } = useContext(AuthContext)
    const [isNewQuestion, setIsNewQuestion] = useState(false)
    const [question, setQuestion] = useState({
        questionId: '',
        title: '',
        statement: '',
        type: 'MCQ',
        options: ['', '', '', ''],
        answer: '',
        hint: '',
        explanation: '',
        section: '',
        difficulty: 'Easy',
    })

    useEffect(() => {
        if (questionId === 'new') {
            setIsNewQuestion(true)
        } else {
            setIsNewQuestion(false)
            const fetchQuestion = async () => {
                try {
                    const { data } = await axios.get(`/api/questions/${questionId}`)
                    setQuestion(data)
                } catch (error) {
                    console.error('Error fetching question:', error)
                    setQuestion({})
                }
            }

            fetchQuestion()
        }
    }, [questionId])

    const handleChange = (e) => {
        const { name, value } = e.target
        if (name.startsWith('option')) {
            const index = parseInt(name.split('-')[1], 10)
            const newOptions = [...question.options]
            newOptions[index] = value
            setQuestion({ ...question, options: newOptions })
        } else {
            setQuestion({ ...question, [name]: value })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!user || !user.isAdmin) {
            alert('You are not authorized to perform this action.')
            return
        }
    
        // Validate required fields
        const requiredFields = ['title', 'statement', 'type', 'answer', 'section', 'difficulty']
        for (const field of requiredFields) {
            if (!question[field]) {
                alert(`Please fill out the ${field} field.`)
                return
            }
        }
    
        // Validate options if type is MCQ
        if (question.type === 'MCQ' && question.options.some(option => !option)) {
            alert('Please fill out all MCQ options.')
            return
        }
    
        // Convert options array to a string
        const questionData = {
            ...question,
            options: question.options.join(','),
        }

        try {
            if (isNewQuestion) {
                await axios.post('/api/questions', questionData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
            } else {
                await axios.put(`/api/questions/${questionId}`, questionData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
            }
            navigate('/admin')
        } catch (error) {
            console.error('Error submitting question:', error)
        }
    }

    const handleDelete = async () => {
        if (!user || !user.isAdmin) {
            alert('You are not authorized to perform this action.')
            return
        }
        try {
            await axios.delete(`/api/questions/${questionId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            navigate('/admin')
        } catch (error) {
            console.error('Error deleting question:', error)
        }
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-4">
                {isNewQuestion ? 'Create Question' : 'Edit Question'}
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Question ID */}
                <div className="form-control flex flex-row items-center">
                    <label className="label w-1/4 text-right">
                        <span className="label-text">Question ID</span>
                    </label>
                    <input 
                        name="questionId" 
                        value={question.questionId} 
                        onChange={handleChange} 
                        placeholder="Question ID" 
                        className="input input-bordered w-3/4" 
                        required 
                    />
                </div>

                {/* Title */}
                <div className="form-control flex flex-row items-center">
                    <label className="label w-1/4 text-right">
                        <span className="label-text">Title</span>
                    </label>
                    <input 
                        name="title" 
                        value={question.title} 
                        onChange={handleChange} 
                        placeholder="Title" 
                        className="input input-bordered w-3/4" 
                        required 
                    />
                </div>

                {/* Statement */}
                <div className="form-control flex flex-row items-center">
                    <label className="label w-1/4 text-right">
                        <span className="label-text">Statement</span>
                    </label>
                    <textarea 
                        name="statement" 
                        value={question.statement} 
                        onChange={handleChange} 
                        placeholder="Statement" 
                        className="textarea textarea-bordered w-3/4" 
                        required 
                    />
                </div>

                {/* Type */}
                <div className="form-control flex flex-row items-center">
                    <label className="label w-1/4 text-right">
                        <span className="label-text">Type</span>
                    </label>
                    <select 
                        name="type" 
                        value={question.type} 
                        onChange={handleChange} 
                        className="select select-bordered w-3/4"
                    >
                        <option value="MCQ">MCQ</option>
                        <option value="Integer">Integer</option>
                    </select>
                </div>

                {/* MCQ Options (only if type is MCQ) */}
                {question.type === 'MCQ' && (
                    <>
                        {question.options.map((option, index) => (
                            <div key={index} className="form-control flex flex-row items-center">
                                <label className="label w-1/4 text-right">
                                    <span className="label-text">Option {index + 1}</span>
                                </label>
                                <input 
                                    name={`option-${index}`} 
                                    value={option} 
                                    onChange={handleChange} 
                                    placeholder={`Option ${index + 1}`} 
                                    className="input input-bordered w-3/4" 
                                />
                            </div>
                        ))}
                    </>
                )}

                {/* Answer */}
                <div className="form-control flex flex-row items-center">
                    <label className="label w-1/4 text-right">
                        <span className="label-text">Answer</span>
                    </label>
                    <input 
                        name="answer" 
                        value={question.answer} 
                        onChange={handleChange} 
                        placeholder="Answer" 
                        className="input input-bordered w-3/4" 
                        required 
                    />
                </div>

                {/* Hint */}
                <div className="form-control flex flex-row items-center">
                    <label className="label w-1/4 text-right">
                        <span className="label-text">Hint</span>
                    </label>
                    <textarea 
                        name="hint" 
                        value={question.hint} 
                        onChange={handleChange} 
                        placeholder="Hint" 
                        className="textarea textarea-bordered w-3/4" 
                    />
                </div>

                {/* Explanation */}
                <div className="form-control flex flex-row items-center">
                    <label className="label w-1/4 text-right">
                        <span className="label-text">Explanation</span>
                    </label>
                    <textarea 
                        name="explanation" 
                        value={question.explanation} 
                        onChange={handleChange} 
                        placeholder="Explanation" 
                        className="textarea textarea-bordered w-3/4" 
                    />
                </div>

                {/* Section */}
                <div className="form-control flex flex-row items-center">
                    <label className="label w-1/4 text-right">
                        <span className="label-text">Section</span>
                    </label>
                    <select 
                        name="section" 
                        value={question.section} 
                        onChange={handleChange} 
                        className="select select-bordered w-3/4"
                    >
                        <option value="Numerical Ability">Numerical Ability</option>
                        <option value="Verbal Reasoning">Verbal Reasoning</option>
                        <option value="Non-verbal Reasoning">Non-verbal Reasoning</option>
                        <option value="Verbal Ability">Verbal Ability</option>
                        <option value="Quantitative Aptitude">Quantitative Aptitude</option>
                        <option value="Data Interpretation">Data Interpretation</option>
                    </select>
                </div>

                {/* Difficulty */}
                <div className="form-control flex flex-row items-center">
                    <label className="label w-1/4 text-right">
                        <span className="label-text">Difficulty</span>
                    </label>
                    <select 
                        name="difficulty" 
                        value={question.difficulty} 
                        onChange={handleChange} 
                        className="select select-bordered w-3/4"
                    >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>

                {/* Submit and Delete Buttons */}
                <div className="form-control flex justify-center space-x-4">
                    <button type="submit" className="btn btn-primary">Submit</button>
                    {!isNewQuestion && (
                        <button type="button" onClick={handleDelete} className="btn btn-error">Delete</button>
                    )}
                </div>
            </form>
        </div>
    )
}

export default EditQuestion