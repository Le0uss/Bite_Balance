import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for navigation

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const handleSearch = async (query) => {
        if (!query) return setSuggestions([]);

        try {
            const response = await axios.get(`/search?term=${query}`);
            setSuggestions(response.data.foods.food || []); // Update to match the structure of your data
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setSuggestions([]);
        }
    };

    return (
        <div className="relative">
            <motion.input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    handleSearch(e.target.value);
                }}
                className="border rounded shadow p-2 w-full bg-white text-black placeholder-white focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-300"
                placeholder="Search food..."
                // Removed whileHover and variants
            />
            {suggestions.length > 0 && (
                <motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="absolute top-full bg-white shadow-lg rounded z-50 w-full"
                >
                    {suggestions.map(suggestion => (
                        <Link 
                            to={`/food/${suggestion.food_id}`} 
                            key={suggestion.food_id}
                            style={{ textDecoration: 'none' }}
                        >
                            <motion.li
                                whileHover={{ backgroundColor: "#f7fafc" }}
                                className="p-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                            >
                                {suggestion.food_name}
                            </motion.li>
                        </Link>
                    ))}
                </motion.ul>
            )}
        </div>
    );
};

export default SearchBar;
