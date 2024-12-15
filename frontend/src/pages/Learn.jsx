import { useState, useEffect } from 'react'
import axios from 'axios'
import CourseCard from '../components/learning/CourseCard'
import SubjectCard from '../components/learning/SubjectCard'
import { AcademicCapIcon, BookOpenIcon } from '@heroicons/react/24/outline'

const Learn = () => {
    const [courses, setCourses] = useState([])
    const [subjects, setSubjects] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coursesRes, subjectsRes] = await Promise.all([
                    axios.get('/api/learning/courses'),
                    axios.get('/api/learning/subjects')
                ])
                setCourses(coursesRes.data)
                setSubjects(subjectsRes.data)
                setLoading(false)
            } catch (error) {
                console.error('Error fetching data:', error)
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-16">
            {/* Exam Preparation Courses Section */}
            <section className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                    <AcademicCapIcon className="w-8 h-8 text-primary" />
                    <h2 className="text-3xl font-bold">Exam Preparation Courses</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <CourseCard key={course._id} course={course} />
                    ))}
                </div>
            </section>

            {/* Individual Subjects Section */}
            <section>
                <div className="flex items-center gap-2 mb-6">
                    <BookOpenIcon className="w-8 h-8 text-primary" />
                    <h2 className="text-3xl font-bold">Subject-wise Learning</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjects.map(subject => (
                        <SubjectCard key={subject._id} subject={subject} />
                    ))}
                </div>
            </section>
        </div>
    )
}

export default Learn
