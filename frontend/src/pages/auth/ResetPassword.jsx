import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'

const ResetPassword = () => {
    const { token } = useParams()
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setMessage('')

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        try {
            const response = await axios.put(`/api/resetpassword/${token}`, { password })
            setMessage(response.data.message)
        } catch (err) {
            setError(err.response?.data?.message || 'Error resetting password')
        }
    }

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                navigate('/login')
            }, 2000) // Redirect after 3 seconds

            return () => clearTimeout(timer) // Cleanup the timer
        }
    }, [message, navigate])

    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200">
            <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-base-100 shadow-lg">
                <h1 className="text-3xl font-bold text-center">Reset Password</h1>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="form-control">
                        <label className="label">
                            <span className="font-bold label-text">New Password</span>
                        </label>
                        <input
                            type="password"
                            placeholder="New Password"
                            className="input input-bordered w-full"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="font-bold label-text">Confirm New Password</span>
                        </label>
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            className="input input-bordered w-full"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    {message && <p className="text-green-500 text-center">{message}</p>}
                    <div className="form-control mt-6">
                        <button className="btn btn-primary w-full">Reset Password</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword