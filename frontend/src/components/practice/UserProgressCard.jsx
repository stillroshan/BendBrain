import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

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

const UserProgressCard = ({ progress }) => {
    if (!progress) {
        return (
            <div className="card bg-base-100 shadow-lg">
                <div className="card-body p-4">
                    <div className="flex justify-center items-center h-48">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="card bg-base-200/50 shadow-lg">
            <div className="card-body p-4">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Your Progress
                </h2>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-base-200 rounded-lg p-4">
                        <div className="text-4xl font-bold text-primary mb-1">
                            {progress.totalQuestionsSolved}
                        </div>
                        <div className="text-sm text-base-content/70">Questions Solved</div>
                    </div>
                    <div className="bg-base-200 rounded-lg p-4">
                        <div className="text-4xl font-bold text-primary mb-1">
                            {progress.averageAccuracy.toFixed(1)}%
                        </div>
                        <div className="text-sm text-base-content/70">Accuracy Rate</div>
                    </div>
                </div>

                {/* Time Stats */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Total Time</span>
                        <span className="text-sm font-bold">{(progress.totalTimeSpent/60).toFixed(1)} mins</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Avg. Time per Question</span>
                        <span className="text-sm font-bold">{progress.averageTimeSpent.toFixed(1)} sec</span>
                    </div>
                </div>

                {/* Difficulty Distribution */}
                <div className="divider my-4 text-sm font-medium">Solved by Difficulty</div>
                <div className="flex justify-between items-center px-2">
                    <RadialProgress
                        difficulty="Easy"
                        solved={progress.difficultyBreakdown?.easy || 0}
                        total={progress.totalQuestions?.easy || 0}
                        color="text-success"
                    />
                    <RadialProgress
                        difficulty="Medium"
                        solved={progress.difficultyBreakdown?.medium || 0}
                        total={progress.totalQuestions?.medium || 0}
                        color="text-warning"
                    />
                    <RadialProgress
                        difficulty="Hard"
                        solved={progress.difficultyBreakdown?.hard || 0}
                        total={progress.totalQuestions?.hard || 0}
                        color="text-error"
                    />
                </div>

                {/* Performance Indicators */}
                <div className="divider my-4 text-sm font-medium">Performance</div>
                <div className="space-y-4">
                    {/* Accuracy Meter */}
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Accuracy</span>
                            <span className="text-sm font-bold">{progress.averageAccuracy.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-base-200 rounded-full h-2.5">
                            <div 
                                className="bg-primary rounded-full h-2.5 transition-all duration-300"
                                style={{ width: `${progress.averageAccuracy}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Time Efficiency */}
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Time Efficiency</span>
                            <span className="text-sm font-bold">
                                {progress.averageTimeSpent < 60 ? 'Excellent' : 
                                 progress.averageTimeSpent < 120 ? 'Good' : 'Needs Improvement'}
                            </span>
                        </div>
                        <div className="w-full bg-base-200 rounded-full h-2.5">
                            <div 
                                className="bg-secondary rounded-full h-2.5 transition-all duration-300"
                                style={{ width: `${Math.min(100, (60 / progress.averageTimeSpent) * 100)}%` }}
                            ></div>
                        </div>
                    </div>

                    <Link 
                        to="/dashboard/analytics" 
                        className="text-sm text-primary hover:text-primary-focus flex items-center gap-1 mt-2"
                    >
                        More Performance Analytics 
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </Link>
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

UserProgressCard.propTypes = {
    progress: PropTypes.shape({
        totalQuestionsSolved: PropTypes.number,
        totalQuestionsAttempted: PropTypes.number,
        averageAccuracy: PropTypes.number,
        totalTimeSpent: PropTypes.number,
        averageTimeSpent: PropTypes.number,
        difficultyBreakdown: PropTypes.shape({
            easy: PropTypes.number,
            medium: PropTypes.number,
            hard: PropTypes.number
        }),
        totalQuestions: PropTypes.shape({
            easy: PropTypes.number,
            medium: PropTypes.number,
            hard: PropTypes.number
        })
    })
}

export default UserProgressCard