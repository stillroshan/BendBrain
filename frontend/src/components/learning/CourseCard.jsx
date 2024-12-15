import PropTypes from 'prop-types'
import { AcademicCapIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

const CourseCard = ({ course }) => {
    return (
        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <figure className="px-6 pt-6">
                <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="rounded-xl h-48 w-full object-cover"
                />
            </figure>
            <div className="card-body">
                <div className="flex justify-between items-start">
                    <h2 className="card-title">
                        <AcademicCapIcon className="h-6 w-6 text-primary" />
                        {course.title}
                    </h2>
                    <div className="badge badge-secondary">{course.examType}</div>
                </div>
                <p className="text-base-content/70">{course.description}</p>
                <div className="mt-4">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold">{course.subjects?.length || 0}</span>
                        <span className="text-base-content/70">Subjects</span>
                    </div>
                </div>
                <div className="card-actions justify-end mt-4">
                    <Link 
                        to={`/learn/courses/${course._id}`}
                        className="btn btn-primary btn-sm gap-2"
                    >
                        View Course
                        <ArrowRightIcon className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </div>
    )
}

CourseCard.propTypes = {
    course: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        thumbnail: PropTypes.string.isRequired,
        examType: PropTypes.string.isRequired,
        subjects: PropTypes.array
    }).isRequired
}

export default CourseCard 