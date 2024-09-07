import { Link, NavLink } from 'react-router-dom'
import ThemeSelector from '../utils/ThemeSelector'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'

const Navbar = () => {
    const { user, logout } = useContext(AuthContext)

    return (
        <nav>
            <div className="navbar bg-base-100 shadow-lg">
                <div className="flex-none" >
                    <NavLink 
                        className={({ isActive }) => 
                            isActive ? "btn btn-ghost text-xl" : "btn btn-ghost text-xl"
                        } 
                        to="/">
                        BendBrain
                    </NavLink>
                </div>
                <div className="flex-1">
                    <NavLink 
                        className={({ isActive }) => 
                            isActive ? "btn btn-ghost text-l active" : "btn btn-ghost text-l"
                        } 
                        to="/">
                        Home
                    </NavLink>
                    <NavLink 
                        className={({ isActive }) => 
                            isActive ? "btn btn-ghost text-l active" : "btn btn-ghost text-l"
                        } 
                        to="/learn">
                        Learn
                    </NavLink>
                    <NavLink 
                        className={({ isActive }) => 
                            isActive ? "btn btn-ghost text-l active" : "btn btn-ghost text-l"
                        } 
                        to="/practice">
                        Practice
                    </NavLink>
                    <NavLink 
                        className={({ isActive }) => 
                            isActive ? "btn btn-ghost text-l active" : "btn btn-ghost text-l"
                        } 
                        to="/compete">
                        Compete
                    </NavLink>
                    <NavLink 
                        className={({ isActive }) => 
                            isActive ? "btn btn-ghost text-l active" : "btn btn-ghost text-l"
                        } 
                        to="/contest">
                        Contest
                    </NavLink>
                    <NavLink 
                        className={({ isActive }) => 
                            isActive ? "btn btn-ghost text-l active" : "btn btn-ghost text-l"
                        } 
                        to="/discuss">
                        Discuss
                    </NavLink>
                </div>
                <div className="flex-none gap-2">
                    {user ? (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img
                            alt="User Avatar"
                            src={user.avatar || 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'}
                            />
                        </div>
                        </div>
                        <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <li>
                            <Link to="/profile" className="justify-between">
                            Profile
                            <span className="badge">New</span>
                            </Link>
                        </li>
                        <li><Link to="/settings">Settings</Link></li>
                        <li><button onClick={logout}>Logout</button></li>
                        </ul>
                    </div>
                    ) : (
                    <>
                        <Link to="/login" className="btn btn-primary">Login</Link>
                        <Link to="/signup" className="btn btn-secondary ml-2">Signup</Link>
                    </>
                    )}
                    <ThemeSelector/>
                </div>
            </div>
        </nav>
    )
}

export default Navbar