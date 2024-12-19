import { Routes, Route, useLocation } from 'react-router-dom'

// Layout Components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Home Page
import Home from './pages/home/Home' 

// Learn Pages
import Learn from './pages/learn/Learn'
import CourseDetail from './pages/learn/CourseDetail'
import SubjectDetail from './pages/learn/SubjectDetail'
import TopicContent from './components/learn/TopicContent'

// Practice Pages
import Practice from './pages/practice/Practice' 
import Question from './pages/practice/Question'
import Lists from './pages/practice/Lists'

// Compete Pages
import Compete from './pages/compete/Compete' 

// Discuss Pages
import Discuss from './pages/discuss/Discuss'
import NewDiscussion from './pages/discuss/NewDiscussion'
import DiscussionDetail from './pages/discuss/DiscussionDetail'

// Admin Pages
import Admin from './pages/admin/Admin'
import EditQuestion from './pages/admin/EditQuestion'

// Profile Pages
import Profile from './pages/profile/Profile'
import Settings from './pages/profile/Settings'

// Auth Pages
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import GoogleAuthSuccess from './pages/auth/GoogleAuthSuccess'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'


function App() {
    const location = useLocation()
    
    // Function to check if footer should be shown
    const shouldShowFooter = () => {
        const footerRoutes = ['/', '/learn']
        return footerRoutes.includes(location.pathname)
    }
    
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<Home />} />

                    <Route path="/learn" element={<Learn />} />
                    <Route path="/learn/:courseId" element={<CourseDetail />} />
                    <Route path="/learn/:courseId/:subjectId" element={<SubjectDetail />} />
                    <Route path="/learn/:courseId/:subjectId/:topicId" element={<TopicContent />} />

                    <Route path="/practice" element={<Practice />} />
                    <Route path="/lists" element={<Lists />} />
                    <Route path="/lists/:listId" element={<Lists />} />
                    <Route path="/question/:questionNumber" element={<Question />} />

                    <Route path="/compete" element={<Compete />} />

                    <Route path="/discuss" element={<Discuss />} />
                    <Route path="/discuss/new" element={<NewDiscussion />} />
                    <Route path="/discuss/:id" element={<DiscussionDetail />} />

                    <Route path="/admin" element={<Admin />} />
                    <Route path="/admin/question/:questionNumber" element={<EditQuestion />} />

                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />
                    <Route path="/forgotpassword" element={<ForgotPassword />} />
                    <Route path="/resetpassword/:token" element={<ResetPassword />} />
                </Routes>
            </main>
            {shouldShowFooter() && <Footer />}
        </div>
    ) 
}

export default App