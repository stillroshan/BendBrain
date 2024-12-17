import { useState } from 'react'
import axios from 'axios'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setMessage('')
        
        try {
            const response = await axios.post('/api/forgotpassword', { email })
            setMessage(response.data.message)
        } catch (err) {
            setError(err.response?.data?.message || 'Error sending email')
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200">
            <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-base-100 shadow-lg">
                <h1 className="text-3xl font-bold text-center">Forgot Password</h1>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="form-control">
                        <label className="label">
                            <span className="font-bold label-text">Email</span>
                        </label>
                        <input 
                            type="email"
                            placeholder="abc@xyz.com"
                            className="input input-bordered w-full"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    {message && <p className="text-green-500 text-center">{message}</p>}
                    <div className="form-control mt-6">
                        <button className="btn btn-primary w-full">Send Reset Link</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword