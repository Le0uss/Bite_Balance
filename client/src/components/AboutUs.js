import React from 'react';
import { motion } from 'framer-motion';

const AboutUs = () => {
    return (
        <motion.div 
            className="p-4 max-w-lg mx-auto bg-white rounded-lg shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-lg font-semibold text-center text-gray-700 mb-4">About Us</h2>
            <p className="text-gray-600">
                Welcome to BiteBalance! We're dedicated to helping you track your dietary habits and achieve your health goals. Our team is passionate about nutrition and technology, and we're excited to bring you the best of both worlds.
            </p>
            <p className="mt-4 text-gray-600">
                Whether you're looking to lose weight, gain muscle, or just maintain a healthy lifestyle, BiteBalance is here to support you on your journey. We believe in the power of data and personalization to make a real difference in your wellness journey.
            </p>
        </motion.div>
    );
};

export default AboutUs;
