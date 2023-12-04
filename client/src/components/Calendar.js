import React, { useState } from 'react';
import axios from 'axios'; 
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import 'tailwindcss/tailwind.css';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const currentYear = new Date().getFullYear();
const years = Array.from(new Array(20), (val, index) => currentYear + index);

const CalendarComponent = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [mealType, setMealType] = useState('');
    const [autocompleteData, setAutocompleteData] = useState([]);

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const daysInMonth = getDaysInMonth(selectedDate.getFullYear(), selectedDate.getMonth());
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i));
    }

    const handleMonthChange = (e) => {
        const newDate = new Date(selectedDate.setMonth(months.indexOf(e.target.value)));
        setSelectedDate(newDate);
    };

    const handleYearChange = (e) => {
        const newDate = new Date(selectedDate.setFullYear(e.target.value));
        setSelectedDate(newDate);
    };

    const selectDate = (date) => {
        localStorage.setItem("date", date )
        setSelectedDate(date);
        setShowSearch(false);
        setMealType('');
    };

    const selectMealType = (type) => {
        setMealType(type);
        setShowSearch(true);
    };

    const handleSearch = async (query) => {
        if (!query) return setAutocompleteData([]); // Updated to use setAutocompleteData

        try {
            const response = await axios.get(`/search?term=${query}`);
            setAutocompleteData(response.data.foods.food || []); // Update to match the structure of your data
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setAutocompleteData([]); // Updated to use setAutocompleteData
        }
    };

    const handleSearchChange = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        await handleSearch(query);
    };

    return (
        <motion.div 
            className="max-w-xl mx-auto bg-white rounded-lg shadow-lg p-8 my-10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex justify-between mb-4">
                <select value={months[selectedDate.getMonth()]} onChange={handleMonthChange}>
                    {months.map((month, index) => (
                        <option key={index} value={month}>{month}</option>
                    ))}
                </select>
                <select value={selectedDate.getFullYear()} onChange={handleYearChange}>
                    {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>
            <div className="grid grid-cols-7 gap-4">
                {daysOfWeek.map(day => (
                    <div key={day} className="text-center font-bold">{day}</div>
                ))}
                {days.map(day => (
                    <motion.button 
                        key={day}
                        onClick={() => selectDate(day)}
                        whileHover={{ scale: 1.1 }}
                        className={`h-10 w-10 rounded-full flex items-center justify-center ${selectedDate.toDateString() === day.toDateString() ? 'bg-green-500 text-white' : 'text-gray-700'}`}
                    >
                        {day.getDate()}
                    </motion.button>
                ))}
            </div>
            {selectedDate && (
                <div className="text-center mt-4 space-x-2">
                    {['Breakfast', 'Lunch', 'Dinner'].map(meal => (
                        <button 
                            key={meal}
                            onClick={() => selectMealType(meal)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                        >
                            {meal}
                        </button>
                    ))}
                </div>
            )}
            {showSearch && (
                <div className="relative mt-4">
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="border rounded shadow p-2 w-full bg-white text-black placeholder-white focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-300"
                        placeholder="Search for a meal..."
                    />
                    {autocompleteData.length > 0 && (
                        <motion.ul
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ type: "spring", stiffness: 100 }}
                            className="absolute top-full bg-white shadow-lg rounded z-50 w-full"
                        >
                            {autocompleteData.map(item => (
                                <Link 
                                    to={`/food/${item.food_id}`} 
                                    key={item.food_id}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <motion.li
                                        whileHover={{ backgroundColor: "#f7fafc" }}
                                        className="p-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                                    >
                                        {item.food_name}
                                    </motion.li>
                                </Link>
                            ))}
                        </motion.ul>
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default CalendarComponent;
