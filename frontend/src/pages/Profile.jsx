import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import ProfilePictureUpload from '../components/ProfilePictureUpload'

const Profile = () => {
  const { user, token } = useContext(AuthContext)
  const [profile, setProfile] = useState({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    newPassword: '',
  })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        const response = await axios.get('/api/profile', config)
        setProfile({
          username: response.data.username,
          email: response.data.email,
          password: '',
          newPassword: '',
        })
      } catch (err) {
        console.error('Error fetching profile data:', err) // Log the error
        setError('Error fetching profile data')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [token])

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      await axios.put('/api/profile', profile, config)
      setMessage('Profile updated successfully')
    } catch (err) {
      console.error('Error updating profile:', err) // Log the error
      setError('Error updating profile')
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-base-100 shadow-lg">
        <h1 className="text-3xl font-bold text-center">Profile</h1>
        <ProfilePictureUpload />
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="font-bold label-text">Username</span>
            </label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="input input-bordered w-full"
              value={profile.username}
              onChange={handleChange}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="font-bold label-text">Email</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="abc@xyz.com"
              className="input input-bordered w-full"
              value={profile.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="font-bold label-text">Current Password</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Current Password"
              className="input input-bordered w-full"
              value={profile.password}
              onChange={handleChange}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="font-bold label-text">New Password</span>
            </label>
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              className="input input-bordered w-full"
              value={profile.newPassword}
              onChange={handleChange}
            />
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {message && <p className="text-green-500 text-center">{message}</p>}
          <div className="form-control mt-6">
            <button className="btn btn-primary w-full">Update Profile</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile