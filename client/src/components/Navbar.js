import React from 'react';
import { Link } from 'react-router-dom';
import LoginLink from './LoginLink';


const Navbar = () => {
    return (
        <nav className="bg-green-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">BiteBalance </Link>
                <div className="flex gap-4">
                    <Link to="/" className="hover:text-green-200 transition duration-300">Home</Link>
                    <Link to="/about" className="hover:text-green-200 transition duration-300">About Us</Link>
                    <Link to="/contactus" className="hover:text-green-200 transition duration-300">Contact Us</Link>
                    <LoginLink />                
                    </div>
            </div>
        </nav>
    );
};

export default Navbar;
