import { Routes, Route} from 'react-router-dom' 
import Home from './pages/Home' 
import Learn from './pages/Learn' 
import Practice from './pages/Practice' 
import Compete from './pages/Compete' 
import Contest from './pages/Contest'
import Discuss from './pages/Discuss'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Navbar from './components/Navbar'

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/learn" element={<Learn />} />
                <Route path="/practice" element={<Practice />} />
                <Route path="/compete" element={<Compete />} />
                <Route path="/contest" element={<Contest />} />
                <Route path="/discuss" element={<Discuss />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </>
    ) 
}

export default App