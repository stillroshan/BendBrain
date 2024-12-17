import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { 
    AcademicCapIcon, 
    BookOpenIcon,
    ChevronRightIcon 
} from '@heroicons/react/24/outline'

const CourseDetail = () => {
    const { courseId } = useParams()
    const [course, setCourse] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await axios.get(`/api/learning/courses/${courseId}`)
                setCourse(response.data)
                setLoading(false)
            } catch (error) {
                console.error('Error fetching course:', error)
                setLoading(false)
            }
        }
        fetchCourse()
    }, [courseId])

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        )
    }

    if (!course) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-xl">Course not found</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-16">
            {/* Course Header */}
            <div className="flex items-start gap-6 mb-8">
                <img 
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-64 h-48 rounded-xl object-cover"
                />
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <AcademicCapIcon className="w-8 h-8 text-primary" />
                        <h1 className="text-3xl font-bold">{course.title}</h1>
                        <span className="badge badge-secondary">{course.examType}</span>
                    </div>
                    <p className="text-base-content/70 mb-4">{course.description}</p>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <BookOpenIcon className="w-5 h-5" />
                            <span>{course.subjects?.length || 0} Subjects</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subjects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {course.subjects?.map(subject => (
                    <div 
                        key={subject._id}
                        className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
                    >
                        <figure className="px-6 pt-6">
                            <img 
                                src={subject.thumbnail}
                                alt={subject.title}
                                className="rounded-xl h-48 w-full object-cover"
                            />
                        </figure>
                        <div className="card-body">
                            <h2 className="card-title">
                                <BookOpenIcon className="h-6 w-6 text-primary" />
                                {subject.title}
                            </h2>
                            <p className="text-base-content/70">{subject.description}</p>
                            <div className="card-actions justify-end mt-4">
                                <Link 
                                    to={`/learn/${courseId}/${subject._id}`}
                                    className="btn btn-primary btn-sm gap-2"
                                >
                                    Start Learning
                                    <ChevronRightIcon className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CourseDetail 