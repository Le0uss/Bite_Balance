const express = require('express');
const router = express.Router();
const searchFood = require('./handlers/searchFood');
const signIn = require('./handlers/signIn'); // Import signIn handler
const signUp = require('./handlers/signUp'); // Import signUp handler
const searchFoodById = require('./handlers/searchFoodById');
const addCalorieIntake = require('./handlers/addFood'); // Import addFood handler
const getUserData = require('./handlers/getUserData'); // Import getUserData handler
const addBMR  = require ("./handlers/addBmr")

router.use(express.json());

// Existing route for searching food
router.get('/search', searchFood);

// New route for sign-in
router.post('/signin', signIn);

// New route for sign-up
router.post('/signup', signUp);

// New route for searching food by ID
router.get('/food/:foodId', searchFoodById);

// New route for adding food
router.post('/addCalories', addCalorieIntake); 

// New route for adding BMR
router.post('/addBMR', addBMR); 

// New route for getting user data by ID
router.get('/user/:userId', getUserData); // Add this line

module.exports = router;
