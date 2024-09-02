/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from 'react'
import axios from 'axios'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('authToken')
            if (token) {
                try {
                    const response = await axios.get('/api/profile', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    setUser(response.data)
                } catch (error) {
                    console.error('Error fetching user:', error)
                }
            }
        }
        fetchUser()
    }, [])

    const logout = () => {
        localStorage.removeItem('authToken')
        setUser(null)
        window.location.href = '/login'
    }

    return (
        <AuthContext.Provider value={{ user, logout }}>
            {children}
        </AuthContext.Provider>
    )
}