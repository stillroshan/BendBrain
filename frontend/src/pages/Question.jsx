import { useState, useEffect, useContext, useRef } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'

const QuestionPage = () => {
    const { questionNumber } = useParams()
    const { user, token } = useContext(AuthContext)
    const [question, setQuestion] = useState(null)
    const [selectedOption, setSelectedOption] = useState('')
    const [inputValue, setInputValue] = useState('')
    const [isCorrect, setIsCorrect] = useState(null)
    const [showAnswer, setShowAnswer] = useState(false)
    const [timeSpent, setTimeSpent] = useState(0)
    const timerRef = useRef(null)

    useEffect(() => {
        const fetchQuestion = async () => {
            const response = await axios.get(`/api/questions/${questionNumber}`)
            setQuestion(response.data)
        }

        fetchQuestion()
    }, [questionNumber])

    useEffect(() => {
        const startTimer = () => {
            timerRef.current = setInterval(() => {
                setTimeSpent(prevTime => prevTime + 1)
            }, 1000)
        }

        startTimer()

        return () => clearInterval(timerRef.current)
    }, [])

    const handleSubmit = async () => {
        clearInterval(timerRef.current)
        const isAnswerCorrect = question.type === 'MCQ' ? selectedOption === question.answer : inputValue === question.answer
        setIsCorrect(isAnswerCorrect)

        const attempts = 1 // For now, we are not handling multiple attempts

        try {
            await axios.post(`/api/questions/${questionNumber}/solved`, {
                userId: user._id,
                section: question.section,
                type: question.type,
                difficulty: question.difficulty,
                attempts: attempts,
                timeSpent: timeSpent,
                accuracy: isAnswerCorrect ? 100 : 0,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        } catch (error) {
            console.error('Error saving solved question:', error);
        }
    }

    const handleRetry = () => {
        setSelectedOption('')
        setInputValue('')
        setIsCorrect(null)
        setShowAnswer(false)
        setTimeSpent(0)
        timerRef.current = setInterval(() => {
            setTimeSpent(prevTime => prevTime + 1)
        }, 1000)
    }

    const handleSeeAnswer = () => {
        clearInterval(timerRef.current)
        setShowAnswer(true)
    }

    if (!question) return <div>Loading...</div>

    return (
        <div className="p-6 bg-base-100 shadow-md rounded-lg max-w-4xl mx-auto mt-16"> {/* Added top margin */}
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-primary">{question.questionNumber}. {question.title}</h1>
   
                {/* Timer Section */}
                <div className="flex items-center">
                    <span className="countdown font-mono text-2xl">
                        <span style={{ "--value": Math.floor(timeSpent / 60) }}></span>:
                        <span style={{ "--value": timeSpent % 60 }}></span>
                    </span>
                </div>
            </div>
    
            {/* Question Statement */}
            <div className="mb-6">
                <p className="text-lg font-normal text-base-content">{question.statement}</p>
            </div>
    
            {/* Options for MCQ or Input for Integer */}
            {question.type === 'MCQ' ? (
                <div className="grid grid-cols-1 gap-4 mb-6">
                    {question.options.map((option, index) => (
                        <div
                            key={index}
                            className={`p-3 border rounded-lg cursor-pointer hover:border-blue-500 transition duration-300 
                            ${selectedOption === option ? 'border-blue-500' : ''} 
                            ${isCorrect !== null && option === question.answer ? 'border-green-500' : ''} 
                            ${isCorrect !== null && selectedOption === option && selectedOption !== question.answer ? 'border-red-500' : ''}`}
                            onClick={() => setSelectedOption(option)}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="mb-6">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className={`input input-bordered w-full p-3 rounded-lg 
                        ${isCorrect !== null && inputValue === question.answer ? 'border-green-500' : ''} 
                        ${isCorrect !== null && inputValue !== question.answer ? 'border-red-500' : ''}`}
                    />
                </div>
            )}
    
            {/* Submit, Retry, and See Answer Buttons */}
            {isCorrect === null ? (
                <button className="btn btn-primary w-full mt-4" onClick={handleSubmit}>
                    Submit
                </button>
            ) : (
                <div className="flex justify-between items-center mt-6">
                    <p className={`text-3xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {isCorrect ? 'Correct Answer!' : 'Incorrect Answer!'}
                    </p>
                    <div className="flex gap-4">
                        <button className="btn btn-outline btn-secondary w-auto md:w-auto" onClick={handleRetry}>
                            Retry
                        </button>
                        <button className="btn btn-outline btn-secondary w-auto md:w-auto" onClick={handleSeeAnswer}>
                            See Answer
                        </button>
                    </div>
                </div>
            )}
    
            {/* Correct Answer Display */}
            {showAnswer && (
                <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
                    <p className="text-lg">The correct answer is: <strong>{question.answer}</strong></p>
                </div>
            )}
        </div>
    )
        
}

export default QuestionPage