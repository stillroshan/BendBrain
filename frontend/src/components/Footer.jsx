import { Link } from 'react-router-dom'
import {
    FaFacebook,
    FaTwitter,
    FaInstagram,
    FaLinkedin,
    FaYoutube
} from 'react-icons/fa'

const Footer = () => {
    return (
        <footer className="bg-base-200 text-base-content">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <Link to="/" className="text-2xl font-bold">BendBrain</Link>
                        <p className="text-base-content/70">
                            Empowering minds through comprehensive aptitude training and competitive exam preparation.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://facebook.com" className="hover:text-primary"><FaFacebook size={24} /></a>
                            <a href="https://twitter.com" className="hover:text-primary"><FaTwitter size={24} /></a>
                            <a href="https://instagram.com" className="hover:text-primary"><FaInstagram size={24} /></a>
                            <a href="https://linkedin.com" className="hover:text-primary"><FaLinkedin size={24} /></a>
                            <a href="https://youtube.com" className="hover:text-primary"><FaYoutube size={24} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link to="/learn" className="hover:text-primary">Learn</Link></li>
                            <li><Link to="/practice" className="hover:text-primary">Practice</Link></li>
                            <li><Link to="/compete" className="hover:text-primary">Compete</Link></li>
                            <li><Link to="/discuss" className="hover:text-primary">Discuss</Link></li>
                            <li><Link to="/blog" className="hover:text-primary">Blog</Link></li>
                        </ul>
                    </div>

                    {/* Exams */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Popular Exams</h3>
                        <ul className="space-y-2">
                            <li><Link to="/learn" className="hover:text-primary">CAT</Link></li>
                            <li><Link to="/learn" className="hover:text-primary">GMAT</Link></li>
                            <li><Link to="/learn" className="hover:text-primary">GRE</Link></li>
                            <li><Link to="/learn" className="hover:text-primary">UPSC</Link></li>
                            <li><Link to="/learn" className="hover:text-primary">Bank PO</Link></li>
                        </ul>
                    </div>

                    {/* Contact & Support */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Contact & Support</h3>
                        <ul className="space-y-2">
                            <li><Link to="/contact" className="hover:text-primary">Contact Us</Link></li>
                            <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
                            <li><Link to="/careers" className="hover:text-primary">Careers</Link></li>
                            <li><Link to="/help" className="hover:text-primary">Help Center</Link></li>
                            <li><Link to="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-base-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-sm text-base-content/70">
                            © 2024 BendBrain. All rights reserved.
                        </div>
                        <div className="flex space-x-6 text-sm">
                            <Link to="/terms" className="hover:text-primary">Terms of Service</Link>
                            <Link to="/privacy" className="hover:text-primary">Privacy Policy</Link>
                            <Link to="/cookies" className="hover:text-primary">Cookie Policy</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer 