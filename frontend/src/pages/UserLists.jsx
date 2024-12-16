import { useState, useEffect, useContext, useCallback } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import ListCard from '../components/lists/ListCard'
import { PlusIcon } from '@heroicons/react/24/outline'
import { AuthContext } from '../context/AuthContext'

const UserLists = () => {
    const { token } = useContext(AuthContext)
    const [lists, setLists] = useState({ createdLists: [], savedLists: [] })
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('created')

    const fetchUserLists = useCallback(async () => {
        try {
            setLoading(true)
            const { data } = await axios.get('/api/lists/user/lists', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setLists(data)
        } catch (error) {
            console.error('Error fetching user lists:', error)
        } finally {
            setLoading(false)
        }
    }, [token])

    useEffect(() => {
        fetchUserLists()
    }, [fetchUserLists])

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-16">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">My Lists</h1>
                <Link to="/lists/create" className="btn btn-primary">
                    <PlusIcon className="w-5 h-5" />
                    Create List
                </Link>
            </div>

            <div className="tabs tabs-boxed mb-6">
                <button
                    className={`tab ${activeTab === 'created' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('created')}
                >
                    Created Lists ({lists.createdLists.length})
                </button>
                <button
                    className={`tab ${activeTab === 'saved' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('saved')}
                >
                    Saved Lists ({lists.savedLists.length})
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeTab === 'created' ? (
                    lists.createdLists.map(list => (
                        <ListCard 
                            key={list._id} 
                            list={list}
                            onSave={fetchUserLists}
                        />
                    ))
                ) : (
                    lists.savedLists.map(list => (
                        <ListCard 
                            key={list._id} 
                            list={list}
                            onSave={fetchUserLists}
                        />
                    ))
                )}
            </div>

            {((activeTab === 'created' && lists.createdLists.length === 0) ||
              (activeTab === 'saved' && lists.savedLists.length === 0)) && (
                <div className="text-center py-8">
                    <p className="text-base-content/70">
                        {activeTab === 'created' 
                            ? "You haven't created any lists yet."
                            : "You haven't saved any lists yet."
                        }
                    </p>
                </div>
            )}
        </div>
    )
}

export default UserLists 