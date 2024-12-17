import { useState, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'

const ProfilePictureUpload = () => {
  const { token, setUser } = useContext(AuthContext)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
  }

  const handleUpload = async () => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      await axios.post('/api/profile/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })

      // Update the user context with the new profile picture
      setUser(prevUser => ({
        ...prevUser,
        profilePicture: Response.data.profilePicture
      }))
      
      alert('Profile picture uploaded successfully')
    } catch (error) {
      console.error('Error uploading profile picture:', error)
    }
  }

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      {preview && <img src={preview} alt="Profile Preview" className="w-32 h-32 object-cover rounded-full my-2" />}
      <button onClick={handleUpload} className="btn btn-primary">Upload</button>
    </div>
  )
}

export default ProfilePictureUpload