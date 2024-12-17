import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline'
import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import 'katex/dist/katex.min.css'

const TopicContent = () => {
    const { topicId } = useParams()
    const [topic, setTopic] = useState(null)
    const [activeHeading, setActiveHeading] = useState('')
    const [sidebarOpen, setSidebarOpen] = useState(true)

    useEffect(() => {
        const fetchTopic = async () => {
            try {
                const response = await axios.get(`/api/learning/topics/${topicId}`)
                setTopic(response.data)
                if (response.data.headings.length > 0) {
                    setActiveHeading(response.data.headings[0].id)
                }
            } catch (error) {
                console.error('Error fetching topic:', error)
            }
        }
        fetchTopic()
    }, [topicId])

    if (!topic) {
        return <div>Loading...</div>
    }

    return (
        <div className="flex min-h-screen bg-base-100">
            {/* Collapsible Sidebar */}
            <div className={`bg-base-200 ${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 fixed h-full pt-16`}>
                <button 
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="absolute right-0 top-20 bg-base-300 p-2 rounded-l"
                >
                    {sidebarOpen ? <ChevronLeftIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />}
                </button>
                
                {sidebarOpen && (
                    <div className="p-4 space-y-2">
                        <h3 className="font-bold text-lg mb-4">{topic.title}</h3>
                        {topic.headings.map((heading) => (
                            <button
                                key={heading.id}
                                onClick={() => setActiveHeading(heading.id)}
                                className={`block w-full text-left px-4 py-2 rounded hover:bg-base-300 ${
                                    activeHeading === heading.id ? 'bg-primary text-primary-content' : ''
                                }`}
                            >
                                {heading.text}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'} p-8 pt-20`}>
                <ReactMarkdown 
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    className="prose max-w-none"
                >
                    {topic.content}
                </ReactMarkdown>
            </div>
        </div>
    )
}

export default TopicContent 