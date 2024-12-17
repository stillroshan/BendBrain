import { useState } from 'react'
import QuestionManager from '../../components/admin/QuestionManager'
import LearningManager from '../../components/admin/LearningManager'

const Admin = () => {
    const [activeTab, setActiveTab] = useState('questions')

    return (
        <div className="container mx-auto px-4 py-8 mt-16">
            <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

            {/* Tab Navigation */}
            <div className="tabs tabs-boxed mb-6">
                <button 
                    className={`tab tab-lg ${activeTab === 'questions' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('questions')}
                >
                    Questions
                </button>
                <button 
                    className={`tab tab-lg ${activeTab === 'learning' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('learning')}
                >
                    Learning Content
                </button>
            </div>

            {/* Tab Content */}
            <div className="bg-base-100 rounded-lg p-6">
                {activeTab === 'questions' ? (
                    <QuestionManager />
                ) : (
                    <LearningManager />
                )}
            </div>
        </div>
    )
}

export default Admin