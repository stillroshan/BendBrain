import PropTypes from 'prop-types'

const RadialProgress = ({ difficulty, solved, total, color }) => {
    const percentage = Math.round((solved / total) * 100) || 0
    
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative w-20 h-20">
                <svg className="w-full h-full -rotate-90">
                    {/* Background circle */}
                    <circle
                        className="text-base-200"
                        strokeWidth="4"
                        stroke="currentColor"
                        fill="transparent"
                        r="36"
                        cx="40"
                        cy="40"
                    />
                    {/* Progress circle */}
                    <circle
                        className={`${color} transition-all duration-1000 ease-in-out`}
                        strokeWidth="4"
                        strokeDasharray={`${percentage * 2.26} 226`}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="36"
                        cx="40"
                        cy="40"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-base font-medium">
                        {percentage}%
                    </span>
                </div>
            </div>
            <div className="text-center space-y-1">
                <div className={`text-sm font-medium ${color}`}>
                    {difficulty}
                </div>
                <div className="text-xs text-base-content/70">
                    {solved}/{total}
                </div>
            </div>
        </div>
    )
}

RadialProgress.propTypes = {
    difficulty: PropTypes.string.isRequired,
    solved: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired
}

export default RadialProgress

