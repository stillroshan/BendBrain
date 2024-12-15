import PropTypes from 'prop-types'
import { BookOpenIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

const SubjectCard = ({ subject }) => {
    return (
        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
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
                        to={`/learn/subjects/${subject._id}`}
                        className="btn btn-primary btn-sm gap-2"
                    >
                        Start Learning
                        <ArrowRightIcon className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </div>
    )
}

SubjectCard.propTypes = {
    subject: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        thumbnail: PropTypes.string.isRequired
    }).isRequired
}

export default SubjectCard 