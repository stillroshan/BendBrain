import { useState } from 'react'
import axios from 'axios'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('') // Clear previous errors
    try {
      const response = await axios.post('/api/login', { email, password })
      const { token } = response.data
      localStorage.setItem('authToken', token)
      // Redirect to dashboard or home page
      window.location.href= '/'
    } catch (err) {
      setError('Invalid email or password', err)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-base-100 shadow-lg">
        <h1 className="text-3xl font-bold text-center">Login</h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="font-bold label-text">Email</span>
            </label>
            <input 
              type="email" 
              placeholder="abc@gmail.com" 
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="font-bold label-text">Password</span>
            </label>
            <input 
              type="password" 
              placeholder="password" 
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-left"><a href="/forgotpassword" className="text-primary">Forgot Password</a></p>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div className="form-control mt-6">
            <button className="btn btn-primary w-full">Login</button>
          </div>
          <div className="form-control mt-6">
              <a href="/api/auth/google" className="btn btn-secondary w-full">Login with Google</a>
          </div>
        </form>
        <p className="text-center">Don&apos;t have an account? <a href="/signup" className="text-primary">Signup</a></p>
      </div>
    </div>
  )
}

export default Login