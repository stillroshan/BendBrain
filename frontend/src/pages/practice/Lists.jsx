import { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'
import ListDrawer from '../../components/practice/ListDrawer'
import ListContent from '../../components/practice/ListContent'
import ListModal from '../../components/practice/ListModal'
import ForkListModal from '../../components/practice/ForkListModal'

const Lists = () => {
    const { user, token } = useContext(AuthContext)
    const { listId } = useParams()
    const navigate = useNavigate()
    const [lists, setLists] = useState([])
    const [selectedList, setSelectedList] = useState(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState(true)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showForkModal, setShowForkModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    // Fetch user's lists (created and saved)
    useEffect(() => {
        const fetchLists = async () => {
            try {
                const response = await axios.get('/api/lists', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setLists(response.data)
            } catch (error) {
                console.error('Error fetching lists:', error)
            }
        }
        if (user) {
            fetchLists()
        }
    }, [user, token])

    // Fetch selected list details
    useEffect(() => {
        const fetchListDetails = async () => {
            if (!listId) return
            
            if (!token) {
                console.error('No token available')
                navigate('/login')
                return
            }

            try {
                const response = await axios.get(`/api/lists/${listId}`, {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
                setSelectedList(response.data)
            } catch (error) {
                console.error('Error fetching list details:', error)
                console.error('Error response:', error.response?.data)
                
                if (error.response?.status === 403) {
                    alert(error.response?.data?.message || 'You do not have access to this list')
                    navigate('/lists')
                } else if (error.response?.status === 401) {
                    navigate('/login')
                } else {
                    navigate('/lists')
                }
            }
        }
        fetchListDetails()
    }, [listId, token, navigate])

    // Find and set default list when lists are loaded
    useEffect(() => {
        if (lists.length > 0 && !listId) {
            const favoritesList = lists.find(list => list.isFavorites)
            if (favoritesList) {
                navigate(`/lists/${favoritesList._id}`)
            }
        }
    }, [lists, listId, navigate])

    const handleCreateList = async (listData) => {
        try {
            const response = await axios.post('/api/lists', listData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setLists([...lists, response.data])
            setShowCreateModal(false)
            navigate(`/lists/${response.data._id}`)
        } catch (error) {
            console.error('Error creating list:', error)
        }
    }

    const handleEditList = async (listData) => {
        try {
            const response = await axios.put(`/api/lists/${selectedList._id}`, listData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setLists(lists.map(list => 
                list._id === response.data._id ? response.data : list
            ))
            setSelectedList(response.data)
            setShowEditModal(false)
        } catch (error) {
            console.error('Error updating list:', error)
        }
    }

    const handleDeleteList = async () => {
        if (!window.confirm('Are you sure you want to delete this list?')) return
        try {
            await axios.delete(`/api/lists/${selectedList._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setLists(lists.filter(list => list._id !== selectedList._id))
            setSelectedList(null)
            navigate('/lists')
        } catch (error) {
            console.error('Error deleting list:', error)
        }
    }

    const handleForkList = async (title) => {
        try {
            const response = await axios.post(`/api/lists/${selectedList._id}/fork`, 
                { title },
                { headers: { Authorization: `Bearer ${token}` }}
            )
            setLists([...lists, response.data])
            setShowForkModal(false)
            navigate(`/lists/${response.data._id}`)
        } catch (error) {
            console.error('Error forking list:', error)
        }
    }

    const handleToggleSave = async () => {
        try {
            await axios.post(`/api/lists/${selectedList._id}/save`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
            // Refresh lists to update saved status
            const response = await axios.get('/api/lists', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setLists(response.data)
        } catch (error) {
            console.error('Error toggling save status:', error)
        }
    }

    const handleToggleVisibility = async () => {
        try {
            const response = await axios.put(`/api/lists/${selectedList._id}`, {
                ...selectedList,
                visibility: selectedList.visibility === 'private' ? 'public' : 'private'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setSelectedList(response.data)
            // Update the list in the lists array
            setLists(lists.map(list => 
                list._id === response.data._id ? response.data : list
            ))
        } catch (error) {
            console.error('Error toggling visibility:', error)
        }
    }

    return (
        <div className="flex mt-16 relative">
            <ListDrawer 
                lists={lists}
                selectedListId={listId}
                isOpen={isDrawerOpen}
                onToggle={() => setIsDrawerOpen(!isDrawerOpen)}
                onCreateClick={() => setShowCreateModal(true)}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />
            
            <main className={`
                flex-1 transition-all duration-300
                ${isDrawerOpen ? 'ml-80' : 'ml-0'}
            `}>
                {selectedList ? (
                    <ListContent 
                        list={selectedList}
                        isDrawerOpen={isDrawerOpen}
                        onToggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
                        onEdit={() => setShowEditModal(true)}
                        onDelete={handleDeleteList}
                        onFork={() => setShowForkModal(true)}
                        onToggleSave={handleToggleSave}
                        onToggleVisibility={handleToggleVisibility}
                        isCreator={user?._id === selectedList.creator._id}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-lg text-base-content/70">
                            Select a list or create a new one
                        </p>
                    </div>
                )}
            </main>

            {/* Modals */}
            {showCreateModal && (
                <ListModal 
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreateList}
                />
            )}

            {showEditModal && (
                <ListModal 
                    list={selectedList}
                    onClose={() => setShowEditModal(false)}
                    onSubmit={handleEditList}
                />
            )}

            {showForkModal && (
                <ForkListModal 
                    onClose={() => setShowForkModal(false)}
                    onFork={handleForkList}
                />
            )}
        </div>
    )
}

export default Lists
