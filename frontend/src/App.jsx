import { Routes, Route, useLocation } from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home from './pages/Home' 

import Learn from './pages/Learn'
import CourseDetail from './pages/CourseDetail'
import SubjectDetail from './pages/SubjectDetail'
import TopicContent from './components/learning/TopicContent'

import Practice from './pages/Practice' 
import Question from './pages/Question'
import QuestionLists from './pages/QuestionLists'
import QuestionListDetail from './pages/QuestionListDetail'
import CreateEditList from './pages/CreateEditList'
import UserLists from './pages/UserLists'

import Compete from './pages/Compete' 

import Discuss from './pages/Discuss'
import NewDiscussion from './pages/NewDiscussion'
import DiscussionDetail from './pages/DiscussionDetail'



import Admin from './pages/Admin'
import EditQuestion from './pages/EditQuestion'

import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Signup from './pages/Signup'
import GoogleAuthSuccess from './pages/GoogleAuthSuccess'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'


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
                    <Route path="/question/:questionNumber" element={<Question />} />
                    <Route path="/lists" element={<QuestionLists />} />
                    <Route path="/lists/create" element={<CreateEditList />} />
                    <Route path="/lists/:id/edit" element={<CreateEditList />} />
                    <Route path="/lists/:id" element={<QuestionListDetail />} />
                    <Route path="/lists/user" element={<UserLists />} />

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