import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Home = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  // Generic Home Page for non-logged-in users
  const GuestHomePage = () => (
    <div className="home-page mt-16">
      <section className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Welcome to BendBrain</h1>
            <p className="py-6 text-lg">
              Your ultimate platform for mastering competitive aptitude.
            </p>
            <a href="/signup">
              <button className="btn btn-primary">Start Preparing Now</button>
            </a>
          </div>
        </div>
      </section>
    </div>
  )

  // Personalized Home Page for logged-in users
  const LoggedInHomePage = () => (
    <div className="home-page mt-16">
      <section className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Welcome Back to BendBrain!</h1>
            <p className="py-6 text-lg">
              Ready to continue your practice or join the next contest?
            </p>
            <div className="flex justify-center space-x-4">
              <a href="/practice">
                <button className="btn btn-primary" onClick={() => navigate('/practice')}>Go to Practice</button>
              </a>
              <a href="/compete">
                <button className="btn btn-secondary" onClick={() => navigate('/compete')}>Join a Contest</button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )

  return (
    <>
      {user ? <LoggedInHomePage /> : <GuestHomePage />}
    </>
  )
}

export default Home
