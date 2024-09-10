import { Routes, Route} from 'react-router-dom' 
import Home from './pages/Home' 
import Learn from './pages/Learn' 
import Practice from './pages/Practice' 
import Compete from './pages/Compete' 
import Discuss from './pages/Discuss'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Signup from './pages/Signup'
import GoogleAuthSuccess from './pages/GoogleAuthSuccess'
import Navbar from './components/Navbar'
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
                <Route path="/profile" element={<Profile />} />
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