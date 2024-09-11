import SolvedQuestion from '../models/SolvedQuestion.js'

// Get progress metrics for a user
const getUserProgress = async (req, res) => {
    const userId = req.user._id
    const { type, section, difficulty } = req.query

    try {
        // Build a filter object for querying the solved questions
        let query = { userId }
        if (type) query.type = type
        if (section) query.section = section
        if (difficulty) query.difficulty = difficulty

        // Query the SolvedQuestion model to get the filtered data
        const solvedQuestions = await SolvedQuestion.find(query)

        // Calculate the progress metrics
        const totalQuestionsSolved = solvedQuestions.length
        const totalAccuracy = solvedQuestions.reduce((acc, q) => acc + q.accuracy, 0)
        const totalTimeSpent = solvedQuestions.reduce((acc, q) => acc + q.timeSpent, 0)
        const averageAccuracy = totalQuestionsSolved ?( totalAccuracy / totalQuestionsSolved ) : 0
        const averageTimeSpent = totalQuestionsSolved ? ( totalTimeSpent / totalQuestionsSolved ) : 0

        return {
            totalQuestionsSolved,
            totalTimeSpent,
            averageAccuracy,
            averageTimeSpent
        }
    } catch (error) {
        res.status(500).json({ message: error.message})
    }

}

export { getUserProgress }