/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from 'react'
import axios from 'axios'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('authToken'))

    useEffect(() => {
        const fetchUser = async () => {
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
    }, [token])

    const logout = () => {
        localStorage.removeItem('authToken')
        setUser(null)
        setToken(null)
        window.location.href = '/login'
    }

    return (
        <AuthContext.Provider value={{ user, token, setToken, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    )
}