import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for HTTP requests

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);


    // Function to handle user sign-in
    const signIn = async (email, password) => {
        try {
            const response = await axios.post('/signin', { email, password });
            localStorage.setItem('userId', response.data.userId); // Store the user's _id
            setCurrentUser(response.data.user); // Update the currentUser
        } catch (error) {
            console.error('Sign-in failed', error);
        }
    };
    // Function to handle user sign-out
    const signOut = () => {
        // Remove the user data from local storage
        localStorage.removeItem('userKey'); // Replace 'userKey' with the actual key used in your application

        // Update the currentUser state
        setCurrentUser(null);
    };
    

    // Function to handle user sign-up
    const signUp = async (userData) => {
        try {
            const response = await axios.post('/signup', userData);
            localStorage.setItem('userId', response.data.userId); // Store the user's _id
            setCurrentUser(response.data.user); // Update the currentUser
        } catch (error) {
            console.error('Sign-up failed', error);
        }
    };
    // Check if token is in localStorage when app loads
    useEffect(() => {
        const fetchUserData = async () => {
            const userId = localStorage.getItem('userId');
            if (userId) {
                try {
                    const response = await axios.get(`/user/${userId}`);
                    setCurrentUser(response.data); // Update the currentUser with fetched data
                } catch (error) {
                    console.error('Error fetching user data', error);
                }
            }
        };

        fetchUserData();
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};
