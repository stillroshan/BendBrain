import { useState, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'

const ProfilePictureUpload = () => {
  const { token } = useContext(AuthContext)
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
      alert('Profile picture uploaded successfully')
    } catch (error) {
      console.error('Error uploading profile picture:', error)
    }
  }

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Profile Preview" />}
      <button onClick={handleUpload}>Upload</button>
    </div>
  )
}

export default ProfilePictureUpload