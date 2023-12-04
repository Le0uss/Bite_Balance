import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from './AuthContext'; // Ensure the correct path


const BMRCalculator = () => {
    const [gender, setGender] = useState('female');
    const [weight, setWeight] = useState(0);
    const [height, setHeight] = useState(0);
    const [age, setAge] = useState(0);
    const [activityLevel, setActivityLevel] = useState('sedentary');
    const [bmr, setBmr] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isSignIn, setIsSignIn] = useState(true); // State to toggle between sign in and sign up
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    
    const { currentUser, signIn, signUp} = useContext(AuthContext);


    const calculateBMR = () => {
        let result = 0;
        if (gender === 'female') {
            if (age >= 0 && age < 3) {
                result = 58.9 * weight - 23.1;
            } else if (age >= 3 && age < 10) {
                result = 20.1 * weight + 507;
            } else if (age >= 10 && age < 18) {
                result = 11.1 * weight + 761;
            } else if (age >= 18 && age < 30) {
                result = 13.1 * weight + 558;
            } else if (age >= 30 && age < 60) {
                result = 9.74 * weight + 694;
            } else if (age >= 60) {
                result = 10.1 * weight + 569;
            }
        } else {
            if (age >= 0 && age < 3) {
                result = 61.0 * weight - 33.7;
            } else if (age >= 3 && age < 10) {
                result = 23.3 * weight + 514;
            } else if (age >= 10 && age < 18) {
                result = 18.4 * weight + 581;
            } else if (age >= 18 && age < 30) {
                result = 16.0 * weight + 545;
            } else if (age >= 30 && age < 60) {
                result = 14.2 * weight + 593;
            } else if (age >= 60) {
                result = 13.5 * weight + 514;
            }
        }

        const activityMultipliers = {
            sedentary: 1.2,
            lightly_active: 1.375,
            moderately_active: 1.55,
            very_active: 1.725,
            extra_active: 1.9
        };

        result *= activityMultipliers[activityLevel];
        setBmr(result);
    };

    const addChangeBMR = async () => {
        if (!currentUser) {
            setShowModal(true);
            return;
        }
const body = { BMR: bmr, _id: currentUser._id}
        try {
      
            const response = await fetch('/addBMR', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(body), 
            });

            if (response.ok) {

                console.log(response);
                // Handle successful response
                console.log('Serving amount updated successfully');
                setShowPopup(true);
                setTimeout(() => setShowPopup(false), 1000);
              } else {
                // Handle errors
                console.error('Error updating bmr');
              }
            } catch (error) {
              console.error('Failed to update bmr', error);
            }
          };

          const handleSignIn = async (e) => {
            e.preventDefault();
            await signIn(email, password);
            setShowModal(false);
          };
        
          const handleSignUp = async (e) => {
            e.preventDefault();
            await signUp({ email, password }); // Assuming signUp needs an object with email and password
            setShowModal(false);
        
        };

    return (
        <motion.div 
            className="p-8 max-w-lg mx-auto my-10 bg-white rounded-lg shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">BMR Calculator</h2>
            
            {/* Gender Selection */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Gender</label>
                <select 
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={gender} 
                    onChange={(e) => setGender(e.target.value)}
                >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                </select>
            </div>

            {/* Weight Input */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Weight (kg)</label>
                <input 
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="number" 
                    value={weight} 
                    onChange={(e) => setWeight(e.target.value)}
                />
            </div>

            {/* Height Input */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Height (cm)</label>
                <input 
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="number" 
                    value={height} 
                    onChange={(e) => setHeight(e.target.value)}
                />
            </div>

            {/* Age Input */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Age (years)</label>
                <input 
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="number" 
                    value={age} 
                    onChange={(e) => setAge(e.target.value)}
                />
            </div>

            {/* Activity Level Selection */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Activity Level</label>
                <select 
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value)}
                >
                    <option value="sedentary">Sedentary (little or no exercise)</option>
                    <option value="lightly_active">Lightly active (light exercise/sports 1-3 days/week)</option>
                    <option value="moderately_active">Moderately active (moderate exercise/sports 3-5 days/week)</option>
                    <option value="very_active">Very active (hard exercise/sports 6-7 days a week)</option>
                    <option value="extra_active">Extra active (very hard exercise & physical job or training 2x/day)</option>
                </select>
            </div>

            {/* Calculate BMR Button */}
            <motion.button 
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={calculateBMR}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Calculate BMR
            </motion.button>
            {bmr && (
    <div className="flex justify-start mt-4">
        <motion.button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addChangeBMR}
        >
            Add/Update BMR
        </motion.button>
        <AnimatePresence>
        {showPopup && (
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="fixed top-5 left-1/2 -translate-x-1/2 bg-green-200 border border-green-400 text-green-700 px-4 py-3 rounded"
                role="alert"
            >
                <span className="block sm:inline">BMR updated successfully!</span>
            </motion.div>
        )}
    </AnimatePresence>
    {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
            <div className="bg-white p-4 max-w-md mx-auto rounded-lg shadow-xl">
              {isSignIn ? (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <h2 className="text-lg font-bold">Sign In</h2>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Email"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
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
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Email"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
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
    </div>
)}

            {/* BMR Result Display */}
            {bmr !== null && (
                <motion.div 
                    className="mt-4 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="text-gray-600">Your Basal Metabolic Rate is:</p>
                    <p className="text-xl font-bold text-gray-800">{bmr.toFixed(2)} kcal/day</p>
                </motion.div>
            )}
        </motion.div>
        
    );
};

export default BMRCalculator;
