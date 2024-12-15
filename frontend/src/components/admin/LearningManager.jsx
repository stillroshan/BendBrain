import { useState, useEffect, useCallback, useContext, useMemo } from 'react'
import axios from 'axios'
import { 
    PlusIcon, 
    PencilSquareIcon, 
    TrashIcon,
    EyeIcon,
    EyeSlashIcon 
} from '@heroicons/react/24/outline'
import { AuthContext } from '../../context/AuthContext'
import CourseForm from '../forms/CourseForm'
import SubjectForm from '../forms/SubjectForm'
import TopicForm from '../forms/TopicForm'

const LearningManager = () => {
    const { token } = useContext(AuthContext)
    const [activeTab, setActiveTab] = useState('courses')
    const [courses, setCourses] = useState([])
    const [subjects, setSubjects] = useState([])
    const [topics, setTopics] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [editItem, setEditItem] = useState(null)
    const [selectedSubject, setSelectedSubject] = useState(null)
    const [loading, setLoading] = useState(true)

    const config = useMemo(() => ({
        headers: {
            Authorization: `Bearer ${token}`
        }
    }), [token])

    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            if (activeTab === 'courses') {
                const res = await axios.get('/api/learning/admin/courses', config)
                setCourses(res.data)
            } else if (activeTab === 'subjects') {
                const res = await axios.get('/api/learning/admin/subjects', config)
                setSubjects(res.data)
            } else if (activeTab === 'topics' && selectedSubject) {
                const res = await axios.get(`/api/learning/subjects/${selectedSubject}`, config)
                setTopics(res.data.topics || [])
            }
            setLoading(false)
        } catch (error) {
            console.error('Error fetching data:', error)
            setLoading(false)
        }
    }, [activeTab, selectedSubject, config])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await axios.get('/api/learning/admin/subjects', config)
                setSubjects(res.data)
            } catch (error) {
                console.error('Error fetching subjects:', error)
            }
        }
        fetchSubjects()
    }, [config])

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return

        try {
            await axios.delete(`/api/learning/${activeTab}/${id}`, config)
            fetchData()
        } catch (error) {
            console.error('Error deleting item:', error)
        }
    }

    const handleTogglePublish = async (id) => {
        try {
            await axios.put(`/api/learning/${activeTab}/${id}/publish`, {}, config)
            fetchData()
        } catch (error) {
            console.error('Error toggling publish status:', error)
        }
    }

    const renderTable = () => {
        switch (activeTab) {
            case 'courses':
                return (
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Exam Type</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map(course => (
                                <tr key={course._id}>
                                    <td>{course.title}</td>
                                    <td>{course.examType}</td>
                                    <td>
                                        <button 
                                            className="btn btn-ghost btn-sm"
                                            onClick={() => handleTogglePublish(course._id)}
                                        >
                                            {course.isPublished ? 
                                                <EyeIcon className="h-5 w-5" /> : 
                                                <EyeSlashIcon className="h-5 w-5" />
                                            }
                                        </button>
                                    </td>
                                    <td className="flex gap-2">
                                        <button 
                                            className="btn btn-ghost btn-sm"
                                            onClick={() => {
                                                setEditItem(course)
                                                setShowForm(true)
                                            }}
                                        >
                                            <PencilSquareIcon className="h-5 w-5" />
                                        </button>
                                        <button 
                                            className="btn btn-ghost btn-sm text-error"
                                            onClick={() => handleDelete(course._id)}
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )

            case 'subjects':
                return (
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map(subject => (
                                <tr key={subject._id}>
                                    <td>{subject.title}</td>
                                    <td>{subject.description}</td>
                                    <td>
                                        <button 
                                            className="btn btn-ghost btn-sm"
                                            onClick={() => handleTogglePublish(subject._id)}
                                        >
                                            {subject.isPublished ? 
                                                <EyeIcon className="h-5 w-5" /> : 
                                                <EyeSlashIcon className="h-5 w-5" />
                                            }
                                        </button>
                                    </td>
                                    <td className="flex gap-2">
                                        <button 
                                            className="btn btn-ghost btn-sm"
                                            onClick={() => {
                                                setEditItem(subject)
                                                setShowForm(true)
                                            }}
                                        >
                                            <PencilSquareIcon className="h-5 w-5" />
                                        </button>
                                        <button 
                                            className="btn btn-ghost btn-sm text-error"
                                            onClick={() => handleDelete(subject._id)}
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )

            case 'topics':
                return (
                    <>
                        <div className="mb-4">
                            <select 
                                className="select select-bordered w-full max-w-xs"
                                value={selectedSubject || ''}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                            >
                                <option value="">Select Subject</option>
                                {subjects.map(subject => (
                                    <option key={subject._id} value={subject._id}>
                                        {subject.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {selectedSubject && (
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Order</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topics.map(topic => (
                                        <tr key={topic._id}>
                                            <td>{topic.title}</td>
                                            <td>{topic.order}</td>
                                            <td>
                                                <button 
                                                    className="btn btn-ghost btn-sm"
                                                    onClick={() => handleTogglePublish(topic._id)}
                                                >
                                                    {topic.isPublished ? 
                                                        <EyeIcon className="h-5 w-5" /> : 
                                                        <EyeSlashIcon className="h-5 w-5" />
                                                    }
                                                </button>
                                            </td>
                                            <td className="flex gap-2">
                                                <button 
                                                    className="btn btn-ghost btn-sm"
                                                    onClick={() => {
                                                        setEditItem(topic)
                                                        setShowForm(true)
                                                    }}
                                                >
                                                    <PencilSquareIcon className="h-5 w-5" />
                                                </button>
                                                <button 
                                                    className="btn btn-ghost btn-sm text-error"
                                                    onClick={() => handleDelete(topic._id)}
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </>
                )
        }
    }

    return (
        <div>
            {/* Tab Navigation */}
            <div className="tabs tabs-bordered mb-6">
                <button 
                    className={`tab tab-lg ${activeTab === 'courses' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('courses')}
                >
                    Courses
                </button>
                <button 
                    className={`tab tab-lg ${activeTab === 'subjects' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('subjects')}
                >
                    Subjects
                </button>
                <button 
                    className={`tab tab-lg ${activeTab === 'topics' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('topics')}
                >
                    Topics
                </button>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end mb-6">
                {(activeTab !== 'topics' || selectedSubject) && (
                    <button 
                        className="btn btn-primary"
                        onClick={() => {
                            setEditItem(null)
                            setShowForm(true)
                        }}
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Add {activeTab.slice(0, -1)}
                    </button>
                )}
            </div>

            {/* Content Table */}
            <div className="overflow-x-auto">
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                ) : (
                    renderTable()
                )}
            </div>

            {/* Forms in Modal */}
            {showForm && (
                <dialog className="modal modal-open">
                    <div className="modal-box w-11/12 max-w-3xl mt-16">
                        {activeTab === 'courses' && (
                            <CourseForm 
                                course={editItem}
                                onClose={() => {
                                    setShowForm(false)
                                    setEditItem(null)
                                }}
                                onSubmit={() => {
                                    setShowForm(false)
                                    setEditItem(null)
                                    fetchData()
                                }}
                            />
                        )}
                        {activeTab === 'subjects' && (
                            <SubjectForm 
                                subject={editItem}
                                onClose={() => {
                                    setShowForm(false)
                                    setEditItem(null)
                                }}
                                onSubmit={() => {
                                    setShowForm(false)
                                    setEditItem(null)
                                    fetchData()
                                }}
                            />
                        )}
                        {activeTab === 'topics' && (
                            <TopicForm 
                                topic={editItem}
                                subjectId={selectedSubject}
                                onClose={() => {
                                    setShowForm(false)
                                    setEditItem(null)
                                }}
                                onSubmit={() => {
                                    setShowForm(false)
                                    setEditItem(null)
                                    fetchData()
                                }}
                            />
                        )}
                    </div>
                </dialog>
            )}
        </div>
    )
}

export default LearningManager 