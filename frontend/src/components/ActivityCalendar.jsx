import { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'

const ActivityCalendar = ({ userId }) => {
    const { token } = useContext(AuthContext)
    const [activityData, setActivityData] = useState({})
    const [currentMonth, setCurrentMonth] = useState(moment())

    useEffect(() => {
        const fetchActivityData = async () => {
            try {
                const startDate = moment(currentMonth).startOf('month').format('YYYY-MM-DD')
                const endDate = moment(currentMonth).endOf('month').format('YYYY-MM-DD')
                
                const response = await axios.get(`/api/dashboard/activity`, {
                    params: {
                        startDate,
                        endDate,
                        userId
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setActivityData(response.data)
            } catch (error) {
                console.error('Error fetching activity data:', error)
            }
        }

        fetchActivityData()
    }, [currentMonth, userId, token])

    const getColorIntensity = (count) => {
        if (count === 0) return 'bg-base-200'
        if (count <= 2) return 'bg-primary/20'
        if (count <= 5) return 'bg-primary/40'
        if (count <= 10) return 'bg-primary/60'
        if (count <= 15) return 'bg-primary/80'
        return 'bg-primary'
    }

    const renderCalendarHeader = () => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        return days.map(day => (
            <div key={day} className="text-xs text-base-content/60 h-8 flex items-center justify-center">
                {day}
            </div>
        ))
    }

    const renderCalendar = () => {
        const startDate = moment(currentMonth).startOf('month')
        const endDate = moment(currentMonth).endOf('month')
        const firstDay = startDate.day()
        const totalDays = endDate.date()
        const weeks = Math.ceil((totalDays + (firstDay === 0 ? 6 : firstDay - 1)) / 7)
        const calendar = []

        let dayCounter = 1
        let currentDate = moment(startDate)

        // Adjust to start from Monday
        const startOffset = firstDay === 0 ? 6 : firstDay - 1

        for (let week = 0; week < weeks; week++) {
            const weekDays = []
            for (let day = 0; day < 7; day++) {
                if ((week === 0 && day < startOffset) || dayCounter > totalDays) {
                    weekDays.push(
                        <div key={`empty-${week}-${day}`} className="w-8 h-8" />
                    )
                } else {
                    const dateStr = currentDate.format('YYYY-MM-DD')
                    const count = activityData[dateStr] || 0
                    
                    weekDays.push(
                        <div 
                            key={dateStr}
                            className={`w-8 h-8 rounded-sm ${getColorIntensity(count)} 
                                      flex items-center justify-center text-xs
                                      hover:ring-2 hover:ring-primary-focus
                                      transition-all duration-200 ease-in-out
                                      ${moment().format('YYYY-MM-DD') === dateStr ? 'ring-2 ring-primary' : ''}`}
                            title={`${count} questions solved on ${currentDate.format('MMM D, YYYY')}`}
                        >
                            {dayCounter}
                        </div>
                    )
                    dayCounter++
                    currentDate = currentDate.add(1, 'day')
                }
            }
            calendar.push(
                <div key={`week-${week}`} className="grid grid-cols-7 gap-1">
                    {weekDays}
                </div>
            )
        }
        return calendar
    }

    return (
        <div className="card bg-base-100 shadow-lg p-6 pl-12 pr-12">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <button 
                        className="btn btn-sm btn-ghost"
                        onClick={() => setCurrentMonth(moment(currentMonth).subtract(1, 'month'))}
                    >
                        ←
                    </button>
                    <span className="text-lg font-bold min-w-[120px] text-center">
                        {currentMonth.format('MMMM YYYY')}
                    </span>
                    <button 
                        className="btn btn-sm btn-ghost"
                        onClick={() => setCurrentMonth(moment(currentMonth).add(1, 'month'))}
                    >
                        →
                    </button>
                </div>
            </div>
            
            <div className="space-y-1">
                <div className="grid grid-cols-7 gap-1">
                    {renderCalendarHeader()}
                </div>
                {renderCalendar()}
            </div>
        </div>
    )
}

ActivityCalendar.propTypes = {
    userId: PropTypes.string
}

export default ActivityCalendar 