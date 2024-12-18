import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'

const EditQuestion = () => {
    const { questionNumber } = useParams()
    const navigate = useNavigate()
    const { token, user } = useContext(AuthContext)
    const [isNewQuestion, setIsNewQuestion] = useState(false)
    const [question, setQuestion] = useState({
        questionNumber: '',
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
        if (questionNumber === 'new') {
            setIsNewQuestion(true)
        } else {
            setIsNewQuestion(false)
            const fetchQuestion = async () => {
                try {
                    const { data } = await axios.get(`/api/questions/${questionNumber}`)
                    setQuestion(data)
                } catch (error) {
                    console.error('Error fetching question:', error)
                    setQuestion({})
                }
            }

            fetchQuestion()
        }
    }, [questionNumber])

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

        try {
            if (isNewQuestion) {
                await axios.post('/api/questions', question, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
            } else {
                await axios.put(`/api/questions/${questionNumber}`, question, {
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
            await axios.delete(`/api/questions/${questionNumber}`, {
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
        <div className="container mx-auto p-6 max-w-4xl mt-16">
            <div className="bg-base-100 shadow-lg rounded-lg p-8">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-base-300">
                    <h1 className="text-3xl font-bold">
                        {isNewQuestion ? 'Create New Question' : 'Edit Question'}
                    </h1>
                    {!isNewQuestion && (
                        <button 
                            type="button" 
                            onClick={handleDelete} 
                            className="btn btn-error btn-outline"
                        >
                            Delete Question
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Question Number and Title in a grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Question Number</span>
                            </label>
                            <input 
                                name="questionNumber" 
                                value={question.questionNumber} 
                                onChange={handleChange} 
                                placeholder="Enter question number" 
                                className="input input-bordered" 
                                required 
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Title</span>
                            </label>
                            <input 
                                name="title" 
                                value={question.title} 
                                onChange={handleChange} 
                                placeholder="Enter question title" 
                                className="input input-bordered" 
                                required 
                            />
                        </div>
                    </div>

                    {/* Statement */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Question Statement</span>
                        </label>
                        <textarea 
                            name="statement" 
                            value={question.statement} 
                            onChange={handleChange} 
                            placeholder="Enter question statement" 
                            className="textarea textarea-bordered min-h-[120px]" 
                            required 
                        />
                    </div>

                    {/* Type, Section, and Difficulty in a grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Type</span>
                            </label>
                            <select 
                                name="type" 
                                value={question.type} 
                                onChange={handleChange} 
                                className="select select-bordered w-full"
                            >
                                <option value="MCQ">MCQ</option>
                                <option value="Integer">Integer</option>
                            </select>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Section</span>
                            </label>
                            <select 
                                name="section" 
                                value={question.section} 
                                onChange={handleChange} 
                                className="select select-bordered w-full"
                            >
                                <option value="Numerical Ability">Numerical Ability</option>
                                <option value="Verbal Reasoning">Verbal Reasoning</option>
                                <option value="Non-verbal Reasoning">Non-verbal Reasoning</option>
                                <option value="Verbal Ability">Verbal Ability</option>
                                <option value="Quantitative Aptitude">Quantitative Aptitude</option>
                                <option value="Data Interpretation">Data Interpretation</option>
                            </select>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Difficulty</span>
                            </label>
                            <select 
                                name="difficulty" 
                                value={question.difficulty} 
                                onChange={handleChange} 
                                className="select select-bordered w-full"
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                    </div>

                    {/* MCQ Options */}
                    {question.type === 'MCQ' && (
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">MCQ Options</span>
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                {question.options.map((option, index) => (
                                    <div key={index} className="form-control">
                                        <div className="input-group">
                                            <span className="bg-base-100 px-4 flex items-center font-medium">
                                                {String.fromCharCode(65 + index)}
                                            </span>
                                            <input 
                                                name={`option-${index}`} 
                                                value={option} 
                                                onChange={handleChange} 
                                                placeholder={`Enter option ${String.fromCharCode(65 + index)}`} 
                                                className="input input-bordered w-full" 
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Answer */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Answer</span>
                        </label>
                        <input 
                            name="answer" 
                            value={question.answer} 
                            onChange={handleChange} 
                            placeholder="Enter correct answer" 
                            className="input input-bordered" 
                            required 
                        />
                    </div>

                    {/* Hint and Explanation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Hint</span>
                            </label>
                            <textarea 
                                name="hint" 
                                value={question.hint} 
                                onChange={handleChange} 
                                placeholder="Enter hint (optional)" 
                                className="textarea textarea-bordered min-h-[100px]" 
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Explanation</span>
                            </label>
                            <textarea 
                                name="explanation" 
                                value={question.explanation} 
                                onChange={handleChange} 
                                placeholder="Enter explanation (optional)" 
                                className="textarea textarea-bordered min-h-[100px]" 
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8 flex justify-center">
                        <button type="submit" className="btn btn-primary btn-wide">
                            {isNewQuestion ? 'Create Question' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditQuestion