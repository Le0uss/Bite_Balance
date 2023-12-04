import React, { useContext, useState } from 'react';
import { AuthContext } from './AuthContext'; // Adjust the path as needed

const LoginLink = () => {
    const { currentUser, signIn, signUp, signOut } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const [isSignIn, setIsSignIn] = useState(true); // Default to the sign-in view
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignOut = () => {
        signOut();
    };

    const handleSignIn = async (event) => {
        event.preventDefault();
        await signIn(email, password);
        setShowModal(false);
    };

    const handleSignUp = async (event) => {
        event.preventDefault();
        await signUp({ email, password });
        setShowModal(false);
    };

    return (
        <>
            {currentUser ? (
                <button onClick={handleSignOut} className="hover:text-green-200 transition duration-300">Sign Out</button>
            ) : (
                <>
                    <button onClick={() => { setIsSignIn(true); setShowModal(true); }} className="hover:text-green-200 transition duration-300">Login</button>
                    <button onClick={() => { setIsSignIn(false); setShowModal(true); }} className="hover:text-green-200 transition duration-300">Sign Up</button>
                </>
            )}
            {showModal && (
    <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
    <div className="bg-white p-4 max-w-md mx-auto rounded-lg shadow-xl">
              {isSignIn ? (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <h2 className="text-lg font-bold">Sign In</h2>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-black"
                    placeholder="Email"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-black"
                    placeholder="Password"
                  />
                  <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Sign In
                  </button>
                  <p className="cursor-pointer text-blue-500 hover:text-blue-700" onClick={() => setIsSignIn(false)}>
                    Need an account? Sign up
                  </p>
                </form>
              ) : (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <h2 className="text-lg font-bold">Sign Up</h2>
                  {/* Repeat inputs for email and password */}
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-black"
                    placeholder="Email"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-black"
                    placeholder="Password"
                  />
                  <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Sign Up
                  </button>
                  <p className="cursor-pointer text-blue-500 hover:text-blue-700" onClick={() => setIsSignIn(true)}>
                    Already have an account? Sign in
                  </p>
                </form>
              )}
              <button onClick={() => setShowModal(false)} className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                Close
              </button>
            </div>
          </div>
        )}
    </>
    );
};

export default LoginLink;
