import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import spinner from '../assets/loader-2_food.gif';
import { AuthContext } from './AuthContext'; // Ensure the correct path
import { motion, AnimatePresence } from 'framer-motion';


const NutritionLabel = () => {
  const { foodId } = useParams();
  const [nutritionData, setNutritionData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [displaySpinner, setDisplaySpinner] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [servingAmount, setServingAmount] = useState('');
  const [isSignIn, setIsSignIn] = useState(true); // State to toggle between sign in and sign up
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPopup, setShowPopup] = useState(false);


  const { currentUser, setCurrentUser, signIn, signUp } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/food/${foodId}`);
        setNutritionData(response.data);
      } catch (error) {
        console.error('Error fetching nutrition data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();

    // Set the spinner to stop after 3 seconds
    const timer = setTimeout(() => {
      setDisplaySpinner(false);
    }, 2000);

    // Clean up the timer
    return () => clearTimeout(timer);
  }, [foodId]);


  const handleServingChange = async (event) => {
    event.preventDefault();
    console.log(currentUser);
    if (!currentUser) {
      setShowModal(true); // Show sign-in/up modal if not signed in
      return;
    }
    // Send POST request to addCalories route
    const totalCalories = servingAmount * (nutritionData?.food?.servings?.serving[0]?.calories || nutritionData?.food?.servings?.serving?.calories);
    const date = localStorage.getItem("date")
    const body = { calories: totalCalories, _id: currentUser._id, date: date}
    // Send POST request to addCalories route
    try {
      
      const response = await fetch('/addCalories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body), // Send totalCalories and userId
      });
    


      if (response.ok) {

        setCurrentUser({...currentUser, calorieIntake: [...currentUser.calorieIntake,{calories: totalCalories, date: date}]})
        console.log(response);
        // Handle successful response
        console.log('Serving amount updated successfully');
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 1000);
      } else {
        // Handle errors
        console.error('Error updating serving amount');
      }
    } catch (error) {
      console.error('Failed to update serving amount:', error);
    }
  };

  if (displaySpinner) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img src={spinner} alt="Loading..." />
      </div>
    );
  } else if (loadingData) {
    return null;
  } else if (!nutritionData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Nutrition data not available.</p>
      </div>
    );
  }
  const handleSignIn = async (e) => {
    e.preventDefault();
    await signIn(email, password);
    setShowModal(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const signUpResponse = await signUp({ email, password }); // Assuming signUp needs an object with email and password
    setShowModal(false);

    // Automatically add calories if serving amount is set
    if (signUpResponse && servingAmount) {
        handleServingChange({ preventDefault: () => {} });
    }
};

  const foodName = nutritionData.food.food_name
  const servingData = Array.isArray(nutritionData.food.servings.serving)
    ? nutritionData.food.servings.serving[0]
    : nutritionData.food.servings.serving;

  const servingSize = servingData.metric_serving_amount && servingData.metric_serving_unit
    ? `${servingData.metric_serving_amount} ${servingData.metric_serving_unit}`
    : `${servingData.number_of_units} serving(s)`;

  return (
    <div className="flex justify-center my-8">
      <div className="bg-white p-8 border border-gray-300 shadow-lg rounded-md max-w-2xl w-full">
        <h1 className="text-xl font-bold border-b pb-3">{foodName}</h1>
        <h2 className="text-lg my-3">Serving Size {servingSize}</h2>
        <div className="border-b pb-3">
          <span className="text-4xl font-bold">{servingData.calories}</span>
          <span className="text-xl font-medium"> Calories</span>
        </div>
        <div className="text-lg">
          <div className="border-b py-2">
            <span className="font-bold">Total Fat </span>{servingData.fat}g
          </div>
          <div className="border-b py-2 pl-4">
            Saturated Fat {servingData.saturated_fat}g
          </div>
          <div className="border-b py-2">
            Cholesterol {servingData.cholesterol}mg
          </div>
          <div className="border-b py-2">
            Sodium {servingData.sodium}mg
          </div>
          <div className="border-b py-2">
            <span className="font-bold">Total Carbohydrate </span>{servingData.carbohydrate}g
          </div>
          <div className="border-b py-2 pl-4">
            Dietary Fiber {servingData.fiber}g
          </div>
          <div className="border-b py-2 pl-4">
            Sugars {servingData.sugar}g
          </div>
          <div className="border-b py-2">
            Protein {servingData.protein}g
          </div>
          <div className="py-2">
            Vitamin D {servingData.vitamin_d ? `${servingData.vitamin_d}μg` : '-'} • Calcium {servingData.calcium ? `${servingData.calcium}mg` : '-'} • Iron {servingData.iron ? `${servingData.iron}mg` : '-'} • Potassium {servingData.potassium ? `${servingData.potassium}mg` : '-'}
          </div>
        </div>
        <p className="text-xs mt-4">* The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.</p>
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
                <span className="block sm:inline">Calories added successfully!</span>
            </motion.div>
        )}
    </AnimatePresence>

        <form onSubmit={handleServingChange} className="mt-4 flex justify-end">
          <input 
              type="number" 
              value={servingAmount}
              onChange={(e) => setServingAmount(e.target.value)}
              className="border border-gray-300 p-1 rounded-md mr-2"
              placeholder="Serving Amount"
          />
          <button 
              type="submit" 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
          >
              Add Calories!
          </button>
        </form>
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
    </div>
  );
};

export default NutritionLabel;
