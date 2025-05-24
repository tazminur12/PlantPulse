import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    FaWater, FaSeedling, FaSun, FaBug,
    FaPlus, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import { useAuth } from '../context/AuthProvider';
import PlantCard from '../components/PlantCard'; // Assume we have this component

const Home = () => {
    const { user } = useAuth();
    const [plants, setPlants] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch plants data
    useEffect(() => {
        const fetchPlants = async () => {
            try {
                const response = await fetch('https://plant-pulse-server.vercel.app/plants');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setPlants(data);
            } catch (err) {
                console.error("Failed to load plant data", err);
                setError('Failed to load plant data. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlants();
    }, []);

    // Memoize filtered plants to prevent unnecessary recalculations
    const popularPlants = React.useMemo(() => plants.slice(0, 6), [plants]);
    const beginnerPlants = React.useMemo(
        () => plants.filter(p => p.careLevel?.toLowerCase() === 'easy').slice(0, 6),
        [plants]
    );

    // Slides configuration
    const slides = React.useMemo(() => [
        {
            title: "Plant Care Tracker",
            description: "Track watering, fertilizing, and monitor the health of your plants with ease.",
            image: "https://i.ibb.co/RV4ZqFK/Health-Getty-Images-1475314230-068b30b5f380418b89350af13bdb111c.jpg"  // local image example
        },
        {
            title: "Never Forget to Water",
            description: "Get personalized reminders for each plant's watering needs.",
            image: "https://i.ibb.co/VYJ4qsZ8/L-BOS-P-WMC-01-CF-white-411c64f6-cb73-419c-8204-eb2154c19b62-2048x2048.jpg"
        },
        {
            title: "Grow Your Plant Knowledge",
            description: "Learn expert tips for keeping your plants thriving.",
            image: "https://i.ibb.co/Z1bbtYnZ/peacelily.jpg"
        }
    ], [user]);

    // Slide navigation handlers
    const nextSlide = useCallback(() => {
        setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, [slides.length]);

    const prevSlide = useCallback(() => {
        setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
    }, [slides.length]);

    // Auto-advance slides
    useEffect(() => {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [nextSlide]);

    // Features data
    const features = React.useMemo(() => [
        { icon: <FaWater />, title: "Watering Schedule", desc: "Never forget when to water your plants." },
        { icon: <FaSeedling />, title: "Growth Tracking", desc: "Track plant progress with photos." },
        { icon: <FaSun />, title: "Light Requirements", desc: "Find optimal light for each plant." },
        { icon: <FaBug />, title: "Pest Alerts", desc: "Detect and treat plant pests early." },
    ], []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">Loading plants...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Slider Section */}
            <section className="relative h-96 overflow-hidden">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                        aria-hidden={index !== currentSlide}
                    >
                        {/* Background image */}
                        {slide.image ? (
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        ) : (
                            <div className={`w-full h-full bg-gradient-to-r ${slide.bg}`}></div>
                        )}

                        {/* Overlay for darkening */}
                        <div className="absolute inset-0 bg-opacity-40"></div>

                        {/* Text content */}
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
                            <h1 className="text-white text-4xl md:text-5xl font-bold drop-shadow-lg mb-4">
                                {slide.title}
                            </h1>
                            <p className="text-white text-xl max-w-3xl drop-shadow-md">{slide.description}</p>
                        </div>
                    </div>
                ))}
                {/* Navigation Controls */}
                <div className="absolute inset-0 flex items-center justify-between px-4">
                    <button
                        onClick={prevSlide}
                        className="bg-white bg-opacity-20 text-white p-2 rounded-full hover:bg-opacity-30 transition-all focus:outline-none focus:ring-2 focus:ring-white"
                        aria-label="Previous slide"
                    >
                        <FaChevronLeft className="text-xl" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="bg-white bg-opacity-20 text-white p-2 rounded-full hover:bg-opacity-30 transition-all focus:outline-none focus:ring-2 focus:ring-white"
                        aria-label="Next slide"
                    >
                        <FaChevronRight className="text-xl" />
                    </button>
                </div>

                {/* Slide Indicators */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'}`}
                            aria-label={`Go to slide ${index + 1}`}
                            aria-current={index === currentSlide}
                        />
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-4 max-w-6xl mx-auto" aria-labelledby="features-heading">
                <h2 id="features-heading" className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
                    Why Use Our Tracker?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
                        >
                            <div className="text-4xl text-emerald-500 dark:text-emerald-400 mb-4 mx-auto">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold dark:text-white mb-2">{feature.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Popular Plants Section */}
            <section className="py-16 px-4 bg-gray-100 dark:bg-gray-800" aria-labelledby="popular-plants-heading">
                <div className="max-w-6xl mx-auto">
                    <h2 id="popular-plants-heading" className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
                        Popular Plants
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {popularPlants.map((plant) => (
                            <PlantCard key={plant.id} plant={plant} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Tips Section */}
            <section className="py-16 px-4 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                            Top Plant Care Mistakes
                        </h3>
                        <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                            {[
                                "Overwatering - The #1 killer of houseplants",
                                "Insufficient sunlight for plant needs",
                                "Neglecting pest control until it's too late",
                                "Using the wrong soil type"
                            ].map((mistake, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="text-emerald-500 dark:text-emerald-400 mr-2">•</span>
                                    {mistake}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                            Beginner-Friendly Plants
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Discover easy-to-care-for plants perfect for novice gardeners:
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            {beginnerPlants.map((plant) => (
                                <span
                                    key={plant.id}
                                    className="bg-emerald-50 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-sm hover:bg-emerald-100 dark:hover:bg-emerald-800 transition-colors"
                                >
                                    {plant.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;