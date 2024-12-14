import { Routes, Route} from 'react-router-dom' 

import Navbar from './components/Navbar'

import Home from './pages/Home' 
import Learn from './pages/Learn' 
import Practice from './pages/Practice' 
import Compete from './pages/Compete' 
import Discuss from './pages/Discuss'
import NewDiscussion from './pages/NewDiscussion'
import DiscussionDetail from './pages/DiscussionDetail'

import Question from './pages/Question'

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
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/learn" element={<Learn />} />
                <Route path="/practice" element={<Practice />} />
                <Route path="/compete" element={<Compete />} />
                <Route path="/discuss" element={<Discuss />} />
                <Route path="/discuss/new" element={<NewDiscussion />} />
                <Route path="/question/:questionNumber" element={<Question />} />
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
        </>
    ) 
}

export default App