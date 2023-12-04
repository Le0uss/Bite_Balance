import Navbar from './Navbar';
import HeroSection from './HeroSection';
import AboutUs from './AboutUs'
import ContactUs from './ContactUs'
import NutritionLabel from './NutritionLabel'; 
import Calculator from "./Calculator"
import Calendar from "./Calendar"
import Journal from "./Journal"
import { AuthProvider } from './AuthContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '../index.css';

const App = () => {
  return (
    
      <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/food/:foodId" element={<NutritionLabel />} /> 
          <Route path="/calculator" element={<Calculator />} /> 
          <Route path="/calendar" element={<Calendar />} /> 
          <Route path="/journal" element={<Journal />} /> 

        </Routes>
      </Router>
      </AuthProvider>
  );
};

export default App;
