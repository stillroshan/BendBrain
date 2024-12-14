import { Link, NavLink, useLocation } from 'react-router-dom'
import ThemeSelector from '../utils/ThemeSelector'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'

const Navbar = () => {
    const { user, logout } = useContext(AuthContext)
    const location = useLocation()

    // Check if current path matches /question/{number}
    const isQuestionPage = /^\/question\/\d+$/.test(location.pathname)

    // Don't render navbar on question page
    if (isQuestionPage) {
        return null
    }

    return (
        <nav>
            <div className="navbar bg-base-100 shadow-lg">
                {/* Logo/Brand Section */}
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            <li><NavLink to="/">Home</NavLink></li>
                            <li><NavLink to="/learn">Learn</NavLink></li>
                            <li><NavLink to="/practice">Practice</NavLink></li>
                            <li><NavLink to="/compete">Compete</NavLink></li>
                            <li><NavLink to="/discuss">Discuss</NavLink></li>
                            {user && user.isAdmin && (
                                <li><NavLink to="/admin">Admin</NavLink></li>
                            )}
                        </ul>
                    </div>
                    <NavLink to="/" className="btn btn-ghost text-xl">BendBrain</NavLink>
                </div>

                {/* Desktop Navigation Links */}
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        <li><NavLink to="/" className={({ isActive }) => isActive ? "btn btn-ghost text-l active" : "btn btn-ghost text-l"}>Home</NavLink></li>
                        <li><NavLink to="/learn" className={({ isActive }) => isActive ? "btn btn-ghost text-l active" : "btn btn-ghost text-l"}>Learn</NavLink></li>
                        <li><NavLink to="/practice" className={({ isActive }) => isActive ? "btn btn-ghost text-l active" : "btn btn-ghost text-l"}>Practice</NavLink></li>
                        <li><NavLink to="/compete" className={({ isActive }) => isActive ? "btn btn-ghost text-l active" : "btn btn-ghost text-l"}>Compete</NavLink></li>
                        <li><NavLink to="/discuss" className={({ isActive }) => isActive ? "btn btn-ghost text-l active" : "btn btn-ghost text-l"}>Discuss</NavLink></li>
                        {user && user.isAdmin && (
                            <li><NavLink to="/admin" className={({ isActive }) => isActive ? "btn btn-ghost text-l active" : "btn btn-ghost text-l"}>Admin</NavLink></li>
                        )}
                    </ul>
                </div>

                {/* User Menu & Theme Selector */}
                <div className="navbar-end">
                    {user ? (
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <img alt="User Avatar" src={user.profilePicture || 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'} />
                                </div>
                            </div>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                                <li><Link to="/profile" className="justify-between">Profile<span className="badge">New</span></Link></li>
                                <li><Link to="/settings">Settings</Link></li>
                                <li><button onClick={logout}>Logout</button></li>
                            </ul>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
                            <Link to="/signup" className="btn btn-secondary btn-sm">Signup</Link>
                        </div>
                    )}
                    <ThemeSelector />
                </div>
            </div>
        </nav>
    )
}

export default Navbar