import { useEffect, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

const GoogleAuthSuccess = () => {
    const { search } = useLocation()
    const navigate = useNavigate()
    const { setToken } = useContext(AuthContext)

    useEffect(() => {
        const params = new URLSearchParams(search)
        const token = params.get('token')

        if (token) {
            localStorage.setItem('authToken', token)
            setToken(token)
            navigate('/')
        } else {
            navigate('/login')
        }
    }, [search, navigate, setToken])

    return null
}

export default GoogleAuthSuccess