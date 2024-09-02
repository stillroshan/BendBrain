import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get('/api/profile', config);
        setProfile(response.data);
      } catch (err) {
        console.error('Error fetching profile data:', err); // Log the error
        setError('Error fetching profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-base-100 shadow-lg">
        <h1 className="text-3xl font-bold text-center">Profile</h1>
        <div className="text-center">
          <img src={profile.avatar || 'https://via.placeholder.com/150'} alt="avatar" className="w-24 h-24 rounded-full mx-auto" />
          <h2 className="text-xl font-bold mt-4">{profile.username}</h2>
          <p className="text-gray-600">{profile.email}</p>
          <p className="mt-4">{profile.bio || 'No bio available'}</p>
          <p className="mt-4">Logged in as: {user.username}</p> {/* Example usage of user */}
        </div>
      </div>
    </div>
  );
};

export default Profile;