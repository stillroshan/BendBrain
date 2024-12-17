import { useState, useEffect, useContext, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'
import ListDrawer from '../../components/practice/ListDrawer'
import ListContent from '../../components/practice/ListContent'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

const QuestionList = () => {
    const { user, token } = useContext(AuthContext)
    const { listId } = useParams()
    const navigate = useNavigate()
    
    const [lists, setLists] = useState([])
    const [selectedList, setSelectedList] = useState(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState(true)
    const [loading, setLoading] = useState(true)

    // Fetch all lists
    const fetchLists = useCallback(async () => {
        try {
            const { data } = await axios.get('/api/lists', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setLists(data.lists)
            
            // If no listId in URL, find and select favorites list
            if (!listId && data.lists.length > 0) {
                const favoritesList = data.lists.find(list => list.isFavorites)
                if (favoritesList) {
                    navigate(`/lists/${favoritesList._id}`)
                }
            }
        } catch (error) {
            console.error('Error fetching lists:', error)
        }
    }, [token, listId, navigate])

    // Fetch specific list
    const fetchList = useCallback(async (id) => {
        try {
            const { data } = await axios.get(`/api/lists/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setSelectedList(data)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching list:', error)
            setLoading(false)
        }
    }, [token])

    useEffect(() => {
        if (!user) {
            navigate('/login')
            return
        }
        fetchLists()
    }, [user, token, navigate, fetchLists])

    useEffect(() => {
        if (listId) {
            fetchList(listId)
        } else {
            setLoading(false)
        }
    }, [listId, fetchList])

    return (
        <div className="flex h-screen bg-base-100 pt-16">
            {/* Drawer */}
            <div 
                className={`fixed left-0 top-16 h-full bg-base-200 transition-all duration-300 z-10
                ${isDrawerOpen ? 'w-80' : 'w-0'}`}
            >
                {isDrawerOpen && (
                    <ListDrawer 
                        lists={lists} 
                        selectedListId={listId}
                        onListSelect={(id) => navigate(`/lists/${id}`)}
                        onRefresh={fetchLists}
                    />
                )}
            </div>

            {/* Toggle Drawer Button */}
            <button
                className={`fixed top-1/2 z-20 bg-base-300 p-2 rounded-r transform -translate-y-1/2 transition-all duration-300
                ${isDrawerOpen ? 'left-80' : 'left-0'}`}
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            >
                {isDrawerOpen ? (
                    <ChevronLeftIcon className="w-5 h-5" />
                ) : (
                    <ChevronRightIcon className="w-5 h-5" />
                )}
            </button>

            {/* Main Content */}
            <div 
                className={`flex-1 transition-all duration-300 overflow-y-auto
                ${isDrawerOpen ? 'ml-80' : 'ml-0'}`}
            >
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                ) : (
                    <ListContent 
                        list={selectedList}
                        onUpdate={() => {}} // We'll implement this later
                        onDelete={() => {
                            navigate('/lists')
                        }}
                    />
                )}
            </div>
        </div>
    )
}

export default QuestionList