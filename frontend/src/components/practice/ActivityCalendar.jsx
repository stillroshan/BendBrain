import { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'

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

    const renderCalendarHeader = () => {
        const weekDays = [
            { key: 'mon', label: 'M' },
            { key: 'tue', label: 'T' },
            { key: 'wed', label: 'W' },
            { key: 'thu', label: 'T' },
            { key: 'fri', label: 'F' },
            { key: 'sat', label: 'S' },
            { key: 'sun', label: 'S' }
        ];
        
        return weekDays.map(day => (
            <div key={day.key} className="text-xs font-medium text-base-content/70 text-center">
                {day.label}
            </div>
        ));
    };

    return (
        <div className="card bg-base-100 shadow-lg">
            <div className="card-body p-4">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Activity Calendar
                </h2>

                <div className="flex justify-between items-center mb-6 pl-2 pr-2">
                    <div className="flex items-center gap-3">
                        <button 
                            className="btn btn-circle btn-ghost btn-sm hover:bg-base-200"
                            onClick={() => setCurrentMonth(moment(currentMonth).subtract(1, 'month'))}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <h3 className="text-lg font-bold text-primary">
                            {currentMonth.format('MMMM YYYY')}
                        </h3>
                        <button 
                            className="btn btn-circle btn-ghost btn-sm hover:bg-base-200"
                            onClick={() => setCurrentMonth(moment(currentMonth).add(1, 'month'))}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div className="space-y-2 pl-2 pr-2">
                    <div className="grid grid-cols-7 gap-1 mb-3">
                        {renderCalendarHeader()}
                    </div>

                    <div className="space-y-2">
                        {renderCalendar()}
                    </div>
                </div>
            </div>
        </div>
    )
}

ActivityCalendar.propTypes = {
    userId: PropTypes.string
}

export default ActivityCalendar 