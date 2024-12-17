import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { 
    BookOpenIcon,
    DocumentTextIcon,
    ChevronRightIcon 
} from '@heroicons/react/24/outline'

const SubjectDetail = () => {
    const { courseId, subjectId } = useParams()
    const [subject, setSubject] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSubject = async () => {
            try {
                const response = await axios.get(`/api/learning/subjects/${subjectId}`)
                setSubject(response.data)
                setLoading(false)
            } catch (error) {
                console.error('Error fetching subject:', error)
                setLoading(false)
            }
        }
        fetchSubject()
    }, [subjectId])

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        )
    }

    if (!subject) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-xl">Subject not found</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-16">
            {/* Subject Header */}
            <div className="flex items-start gap-6 mb-8">
                <img 
                    src={subject.thumbnail}
                    alt={subject.title}
                    className="w-64 h-48 rounded-xl object-cover"
                />
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <BookOpenIcon className="w-8 h-8 text-primary" />
                        <h1 className="text-3xl font-bold">{subject.title}</h1>
                    </div>
                    <p className="text-base-content/70 mb-4">{subject.description}</p>
                </div>
            </div>

            {/* Topics List */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="text-2xl font-bold mb-4">Topics</h2>
                    <div className="space-y-4">
                        {subject.topics?.map((topic, index) => (
                            <div 
                                key={topic._id}
                                className="flex items-center justify-between p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors duration-300"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold">
                                        {index + 1}
                                    </span>
                                    <div>
                                        <h3 className="font-semibold">{topic.title}</h3>
                                    </div>
                                </div>
                                <Link 
                                    to={`/learn/${courseId}/${subjectId}/${topic._id}`}
                                    className="btn btn-primary btn-sm gap-2"
                                >
                                    <DocumentTextIcon className="h-4 w-4" />
                                    Study
                                    <ChevronRightIcon className="h-4 w-4" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SubjectDetail 