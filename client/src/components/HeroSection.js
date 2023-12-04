import SearchBar from './SearchBar';
import { HoverImageLinks } from './HoverLinks';
import img from "../assets/DALLE_2023-11-29_19.37.26_-_A_logo_for_Bite_Balance_a_web_application._The_logo_is_creatively_designed_to_resemble_a_hamburger_shaped_like_the_letter_B_with_a_bite_taken_ou.png"

const HeroSection = () => {
    return (
        <div className="bg-white text-black p-10 text-center  flex-col justify-center items-center h-screen">
            <div className="mb-10 w-full">
                <h2 className="text-3xl font-bold mb-2">Track Your Calories Effortlessly</h2>
                <p className="mb-4">Join BiteBalance and make your calorie counting simple and effective.</p>
                
                {/* Logo placed below the h2 tag */}
                <img src={img} alt="Bite Balance Logo" className="mx-auto mb-4 w-24" />

                <SearchBar/>
            </div>

            <HoverImageLinks />
        </div>
    );
};

export default HeroSection;
