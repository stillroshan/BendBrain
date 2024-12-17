import { useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'

const Settings = () => {
    const { user, token } = useContext(AuthContext)
    const [activeTab, setActiveTab] = useState('basic')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    
    // Basic Info State
    const [basicInfo, setBasicInfo] = useState({
        fullName: user?.fullName || '',
        bio: user?.bio || '',
        location: user?.location || '',
        website: user?.website || '',
        github: user?.github || '',
        linkedin: user?.linkedin || ''
    })

    // Account Settings State
    const [accountSettings, setAccountSettings] = useState({
        username: user?.username || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    // Privacy Settings State
    const [privacySettings, setPrivacySettings] = useState({
        profileVisibility: user?.privacySettings?.profileVisibility || 'public',
        showProgress: user?.privacySettings?.showProgress ?? true,
        showActivity: user?.privacySettings?.showActivity ?? true,
        showEmail: user?.privacySettings?.showEmail ?? false
    })

    // Notification Settings State
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: user?.notificationSettings?.emailNotifications ?? true,
        discussionReplies: user?.notificationSettings?.discussionReplies ?? true,
        newContests: user?.notificationSettings?.newContests ?? true,
        newBadges: user?.notificationSettings?.newBadges ?? true,
        weeklyProgress: user?.notificationSettings?.weeklyProgress ?? true
    })

    const handleBasicInfoSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.put('/api/settings/basic', basicInfo, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setMessage('Basic information updated successfully')
            setTimeout(() => setMessage(''), 3000)
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating basic information')
            setTimeout(() => setError(''), 3000)
        }
    }

    const handleAccountSettingsSubmit = async (e) => {
        e.preventDefault()
        if (accountSettings.newPassword !== accountSettings.confirmPassword) {
            setError('New passwords do not match')
            return
        }
        try {
            await axios.put('/api/settings/account', accountSettings, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setMessage('Account settings updated successfully')
            setTimeout(() => setMessage(''), 3000)
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating account settings')
            setTimeout(() => setError(''), 3000)
        }
    }

    const handlePrivacySettingsSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.put('/api/settings/privacy', privacySettings, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setMessage('Privacy settings updated successfully')
            setTimeout(() => setMessage(''), 3000)
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating privacy settings')
            setTimeout(() => setError(''), 3000)
        }
    }

    const handleNotificationSettingsSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.put('/api/settings/notifications', notificationSettings, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setMessage('Notification settings updated successfully')
            setTimeout(() => setMessage(''), 3000)
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating notification settings')
            setTimeout(() => setError(''), 3000)
        }
    }

    return (
        <div className="min-h-screen bg-base-200 mt-12">
            <div className="max-w-5xl mx-auto px-4 py-8">

                <div className="flex gap-6">
                    {/* Left Sidebar - Navigation */}
                    <div className="w-64 shrink-0">
                        <div className="bg-base-100 rounded-lg p-4 shadow-lg">
                            <ul className="space-y-2">
                                <li>
                                    <button 
                                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors
                                            ${activeTab === 'basic' 
                                                ? 'bg-primary text-primary-content' 
                                                : 'hover:bg-base-200'}`}
                                        onClick={() => setActiveTab('basic')}
                                    >
                                        Basic Info
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors
                                            ${activeTab === 'account' 
                                                ? 'bg-primary text-primary-content' 
                                                : 'hover:bg-base-200'}`}
                                        onClick={() => setActiveTab('account')}
                                    >
                                        Account
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors
                                            ${activeTab === 'privacy' 
                                                ? 'bg-primary text-primary-content' 
                                                : 'hover:bg-base-200'}`}
                                        onClick={() => setActiveTab('privacy')}
                                    >
                                        Privacy
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors
                                            ${activeTab === 'notifications' 
                                                ? 'bg-primary text-primary-content' 
                                                : 'hover:bg-base-200'}`}
                                        onClick={() => setActiveTab('notifications')}
                                    >
                                        Notifications
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="flex-1">
                        <div className="bg-base-100 rounded-lg p-6 shadow-lg">
                            {/* Messages */}
                            {message && (
                                <div className="alert alert-success mb-6">
                                    <span>{message}</span>
                                </div>
                            )}
                            {error && (
                                <div className="alert alert-error mb-6">
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Basic Info Settings */}
                            {activeTab === 'basic' && (
                                <>
                                    <h2 className="text-2xl font-bold mb-6">Basic Information</h2>
                                    <form onSubmit={handleBasicInfoSubmit} className="space-y-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">Full Name</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="input input-bordered w-full"
                                                    value={basicInfo.fullName}
                                                    onChange={(e) => setBasicInfo({...basicInfo, fullName: e.target.value})}
                                                />
                                            </div>
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">Location</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="input input-bordered w-full"
                                                    value={basicInfo.location}
                                                    onChange={(e) => setBasicInfo({...basicInfo, location: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">Bio</span>
                                            </label>
                                            <textarea
                                                className="textarea textarea-bordered h-24"
                                                value={basicInfo.bio}
                                                onChange={(e) => setBasicInfo({...basicInfo, bio: e.target.value})}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">Website</span>
                                                </label>
                                                <input
                                                    type="url"
                                                    className="input input-bordered w-full"
                                                    value={basicInfo.website}
                                                    onChange={(e) => setBasicInfo({...basicInfo, website: e.target.value})}
                                                />
                                            </div>
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">GitHub</span>
                                                </label>
                                                <input
                                                    type="url"
                                                    className="input input-bordered w-full"
                                                    value={basicInfo.github}
                                                    onChange={(e) => setBasicInfo({...basicInfo, github: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div className="pt-4">
                                            <button type="submit" className="btn btn-primary min-w-[200px]">
                                                Save Changes
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}

                            {/* Account Settings */}
                            {activeTab === 'account' && (
                                <>
                                    <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                                    <form onSubmit={handleAccountSettingsSubmit} className="space-y-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">Username</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="input input-bordered w-full"
                                                    value={accountSettings.username}
                                                    onChange={(e) => setAccountSettings({...accountSettings, username: e.target.value})}
                                                />
                                            </div>
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">Email</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    className="input input-bordered w-full"
                                                    value={accountSettings.email}
                                                    onChange={(e) => setAccountSettings({...accountSettings, email: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div className="divider">Change Password</div>
                                        <div className="space-y-4">
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">Current Password</span>
                                                </label>
                                                <input
                                                    type="password"
                                                    className="input input-bordered w-full max-w-md"
                                                    value={accountSettings.currentPassword}
                                                    onChange={(e) => setAccountSettings({...accountSettings, currentPassword: e.target.value})}
                                                />
                                            </div>
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">New Password</span>
                                                </label>
                                                <input
                                                    type="password"
                                                    className="input input-bordered w-full max-w-md"
                                                    value={accountSettings.newPassword}
                                                    onChange={(e) => setAccountSettings({...accountSettings, newPassword: e.target.value})}
                                                />
                                            </div>
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">Confirm New Password</span>
                                                </label>
                                                <input
                                                    type="password"
                                                    className="input input-bordered w-full max-w-md"
                                                    value={accountSettings.confirmPassword}
                                                    onChange={(e) => setAccountSettings({...accountSettings, confirmPassword: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div className="pt-4">
                                            <button type="submit" className="btn btn-primary min-w-[200px]">
                                                Update Account
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}

                            {/* Privacy Settings */}
                            {activeTab === 'privacy' && (
                                <>
                                    <h2 className="text-2xl font-bold mb-6">Privacy Settings</h2>
                                    <form onSubmit={handlePrivacySettingsSubmit} className="space-y-6">
                                        <div className="card bg-base-200 p-4 rounded-lg">
                                            <div className="form-control">
                                                <label className="label cursor-pointer">
                                                    <div>
                                                        <span className="label-text font-medium">Profile Visibility</span>
                                                        <p className="text-sm text-base-content/70 mt-1">
                                                            Control who can see your profile
                                                        </p>
                                                    </div>
                                                    <select
                                                        className="select select-bordered w-40"
                                                        value={privacySettings.profileVisibility}
                                                        onChange={(e) => setPrivacySettings({
                                                            ...privacySettings,
                                                            profileVisibility: e.target.value
                                                        })}
                                                    >
                                                        <option value="public">Public</option>
                                                        <option value="private">Private</option>
                                                        <option value="friends">Friends Only</option>
                                                    </select>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="card bg-base-200 p-4 rounded-lg">
                                            <div className="form-control">
                                                <label className="label cursor-pointer">
                                                    <div>
                                                        <span className="label-text font-medium">Show Progress on Profile</span>
                                                        <p className="text-sm text-base-content/70 mt-1">
                                                            Display your learning progress on your profile
                                                        </p>
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        className="toggle toggle-primary"
                                                        checked={privacySettings.showProgress}
                                                        onChange={(e) => setPrivacySettings({
                                                            ...privacySettings,
                                                            showProgress: e.target.checked
                                                        })}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="card bg-base-200 p-4 rounded-lg">
                                            <div className="form-control">
                                                <label className="label cursor-pointer">
                                                    <div>
                                                        <span className="label-text font-medium">Show Activity</span>
                                                        <p className="text-sm text-base-content/70 mt-1">
                                                            Show your recent activity on your profile
                                                        </p>
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        className="toggle toggle-primary"
                                                        checked={privacySettings.showActivity}
                                                        onChange={(e) => setPrivacySettings({
                                                            ...privacySettings,
                                                            showActivity: e.target.checked
                                                        })}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="card bg-base-200 p-4 rounded-lg">
                                            <div className="form-control">
                                                <label className="label cursor-pointer">
                                                    <div>
                                                        <span className="label-text font-medium">Show Email</span>
                                                        <p className="text-sm text-base-content/70 mt-1">
                                                            Make your email visible to other users
                                                        </p>
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        className="toggle toggle-primary"
                                                        checked={privacySettings.showEmail}
                                                        onChange={(e) => setPrivacySettings({
                                                            ...privacySettings,
                                                            showEmail: e.target.checked
                                                        })}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="pt-4">
                                            <button type="submit" className="btn btn-primary min-w-[200px]">
                                                Save Privacy Settings
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}

                            {/* Notification Settings */}
                            {activeTab === 'notifications' && (
                                <>
                                    <h2 className="text-2xl font-bold mb-6">Notification Settings</h2>
                                    <form onSubmit={handleNotificationSettingsSubmit} className="space-y-6">
                                        <div className="card bg-base-200 p-4 rounded-lg">
                                            <div className="form-control">
                                                <label className="label cursor-pointer">
                                                    <div>
                                                        <span className="label-text font-medium">Email Notifications</span>
                                                        <p className="text-sm text-base-content/70 mt-1">
                                                            Receive notifications via email
                                                        </p>
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        className="toggle toggle-primary"
                                                        checked={notificationSettings.emailNotifications}
                                                        onChange={(e) => setNotificationSettings({
                                                            ...notificationSettings,
                                                            emailNotifications: e.target.checked
                                                        })}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="card bg-base-200 p-4 rounded-lg">
                                            <div className="form-control">
                                                <label className="label cursor-pointer">
                                                    <div>
                                                        <span className="label-text font-medium">Discussion Replies</span>
                                                        <p className="text-sm text-base-content/70 mt-1">
                                                            Get notified when someone replies to your discussions
                                                        </p>
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        className="toggle toggle-primary"
                                                        checked={notificationSettings.discussionReplies}
                                                        onChange={(e) => setNotificationSettings({
                                                            ...notificationSettings,
                                                            discussionReplies: e.target.checked
                                                        })}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="card bg-base-200 p-4 rounded-lg">
                                            <div className="form-control">
                                                <label className="label cursor-pointer">
                                                    <div>
                                                        <span className="label-text font-medium">New Contests</span>
                                                        <p className="text-sm text-base-content/70 mt-1">
                                                            Get notified about upcoming contests
                                                        </p>
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        className="toggle toggle-primary"
                                                        checked={notificationSettings.newContests}
                                                        onChange={(e) => setNotificationSettings({
                                                            ...notificationSettings,
                                                            newContests: e.target.checked
                                                        })}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="card bg-base-200 p-4 rounded-lg">
                                            <div className="form-control">
                                                <label className="label cursor-pointer">
                                                    <div>
                                                        <span className="label-text font-medium">Weekly Progress Report</span>
                                                        <p className="text-sm text-base-content/70 mt-1">
                                                            Receive weekly summary of your progress
                                                        </p>
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        className="toggle toggle-primary"
                                                        checked={notificationSettings.weeklyProgress}
                                                        onChange={(e) => setNotificationSettings({
                                                            ...notificationSettings,
                                                            weeklyProgress: e.target.checked
                                                        })}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="pt-4">
                                            <button type="submit" className="btn btn-primary min-w-[200px]">
                                                Save Notification Settings
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings
