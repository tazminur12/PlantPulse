import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FaWater, FaSeedling, FaSun, FaBug,
    FaPlus, FaChevronLeft, FaChevronRight,
    FaChartLine, FaLeaf, FaTemperatureLow, FaCloudRain
} from 'react-icons/fa';
import { useAuth } from '../context/AuthProvider';
import PlantCard from '../components/PlantCard';
import { debounce } from 'lodash';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { motion } from 'framer-motion';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

const cardVariants = {
  offscreen: {
    y: 50,
    opacity: 0
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8
    }
  }
};

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [plants, setPlants] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Responsive window width tracking
    useEffect(() => {
        const handleResize = debounce(() => {
            setWindowWidth(window.innerWidth);
        }, 200);

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fetch plants data with error handling and abort controller
    useEffect(() => {
        const abortController = new AbortController();

        const fetchPlants = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('https://plant-pulse-server.vercel.app/plants', {
                    signal: abortController.signal
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data = await response.json();
                setPlants(data);
                setError(null);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error("Failed to load plant data", err);
                    setError('Failed to load plant data. Please try again later.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlants();
        return () => abortController.abort();
    }, []);

    // Memoized filtered plants with search functionality
    const filteredPlants = React.useMemo(() => {
        return plants.filter(plant =>
            plant.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            plant.scientificName?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [plants, searchQuery]);

    const popularPlants = React.useMemo(() =>
        filteredPlants
            .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
            .slice(0, 6),
        [filteredPlants]
    );

    const beginnerPlants = React.useMemo(() =>
        filteredPlants
            .filter(p => p.careLevel?.toLowerCase() === 'easy')
            .slice(0, 6),
        [filteredPlants]
    );

    // Enhanced slides configuration with responsive images
    const slides = React.useMemo(() => [
        {
            title: "Plant Care Tracker",
            description: "Track watering, fertilizing, and monitor the health of your plants with ease.",
            image: {
                desktop: "https://i.ibb.co/RV4ZqFK/Health-Getty-Images-1475314230-068b30b5f380418b89350af13bdb111c.jpg",
                mobile: "https://i.ibb.co/4W4z7yX/mobile-plant-health.jpg"
            },
            cta: {
                text: "Start Tracking",
                action: () => navigate(user ? '/dashboard' : '/register')
            }
        },
        {
            title: "Never Forget to Water",
            description: "Get personalized reminders for each plant's watering needs.",
            image: {
                desktop: "https://i.ibb.co/VYJ4qsZ8/L-BOS-P-WMC-01-CF-white-411c64f6-cb73-419c-8204-eb2154c19b62-2048x2048.jpg",
                mobile: "https://i.ibb.co/7Q5zXJY/mobile-watering.jpg"
            },
            cta: {
                text: "Set Reminders",
                action: () => navigate('/reminder')
            }
        },
        {
            title: "Grow Your Plant Knowledge",
            description: "Learn expert tips for keeping your plants thriving.",
            image: {
                desktop: "https://i.ibb.co/Z1bbtYnZ/peacelily.jpg",
                mobile: "https://i.ibb.co/0jX5Y5N/mobile-knowledge.jpg"
            },
            cta: {
                text: "Learn More",
                action: () => navigate('/plant-care')
            }
        }
    ], [user, navigate]);

    // Enhanced slide navigation with keyboard support
    const nextSlide = useCallback(() => {
        setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, [slides.length]);

    const prevSlide = useCallback(() => {
        setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
    }, [slides.length]);

    // Auto-advance slides with pause on hover
    useEffect(() => {
        let interval;
        const slider = document.getElementById('hero-slider');

        const startInterval = () => {
            interval = setInterval(nextSlide, 5000);
        };

        const pauseInterval = () => {
            clearInterval(interval);
        };

        startInterval();
        slider?.addEventListener('mouseenter', pauseInterval);
        slider?.addEventListener('mouseleave', startInterval);

        return () => {
            clearInterval(interval);
            slider?.removeEventListener('mouseenter', pauseInterval);
            slider?.removeEventListener('mouseleave', startInterval);
        };
    }, [nextSlide]);

    // Keyboard navigation for slides
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextSlide, prevSlide]);

    // Enhanced features data with metrics
    const features = React.useMemo(() => [
        {
            icon: <FaWater />,
            title: "Watering Schedule",
            desc: "Personalized reminders based on each plant's needs.",
            metric: "98%",
            metricDesc: "reduction in overwatering"
        },
        {
            icon: <FaChartLine />,
            title: "Growth Tracking",
            desc: "Visual progress reports with photo timelines.",
            metric: "2.5x",
            metricDesc: "faster growth observed"
        },
        {
            icon: <FaTemperatureLow />,
            title: "Environment Monitoring",
            desc: "Track light, humidity, and temperature needs.",
            metric: "89%",
            metricDesc: "healthier plants"
        },
        {
            icon: <FaBug />,
            title: "Pest Detection",
            desc: "Early alerts and treatment recommendations.",
            metric: "75%",
            metricDesc: "faster recovery"
        },
    ], []);

    // Loading skeleton component
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
                {/* Skeleton for hero section */}
                <div className="h-96 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>

                {/* Skeleton for features */}
                <section className="py-16 px-4 max-w-6xl mx-auto">
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto mb-12 animate-pulse"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-gray-200 dark:bg-gray-700 p-6 rounded-lg h-64 animate-pulse"></div>
                        ))}
                    </div>
                </section>

                {/* Skeleton for plant cards */}
                <section className="py-16 px-4 bg-gray-100 dark:bg-gray-800">
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto mb-12 animate-pulse"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-gray-200 dark:bg-gray-700 h-80 rounded-lg animate-pulse"></div>
                        ))}
                    </div>
                </section>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md">
                    <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            Go Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Enhanced Hero Slider with responsive images and 3D effect */}
            <section
                id="hero-slider"
                className="relative h-96 overflow-hidden"
                aria-roledescription="carousel"
                aria-label="Featured plant care tips"
            >
                {slides.map((slide, index) => (
                    <motion.div
                        key={index}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`Slide ${index + 1} of ${slides.length}`}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                        aria-hidden={index !== currentSlide}
                        initial={{ scale: 1.05 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 5, ease: "linear" }}
                    >
                        <LazyLoadImage
                            src={windowWidth >= 768 ? slide.image.desktop : slide.image.mobile}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                            effect="blur"
                            width="100%"
                            height="100%"
                        />

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20"></div>

                        {/* Text content with CTA */}
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
                            <motion.div 
                                className="max-w-3xl"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                            >
                                <h1 className="text-white text-4xl md:text-5xl font-bold drop-shadow-lg mb-4">
                                    {slide.title}
                                </h1>
                                <p className="text-white text-xl md:text-2xl drop-shadow-md mb-8">
                                    {slide.description}
                                </p>
                                <motion.button
                                    onClick={slide.cta.action}
                                    className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {slide.cta.text}
                                </motion.button>
                            </motion.div>
                        </div>
                    </motion.div>
                ))}

                {/* Navigation Controls with ARIA labels */}
                <div className="absolute inset-0 flex items-center justify-between px-4">
                    <motion.button
                        onClick={prevSlide}
                        className="bg-white/20 text-white p-3 rounded-full hover:bg-white/30 transition-all focus:outline-none focus:ring-2 focus:ring-white z-20"
                        aria-label="Previous slide"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FaChevronLeft className="text-xl" />
                    </motion.button>
                    <motion.button
                        onClick={nextSlide}
                        className="bg-white/20 text-white p-3 rounded-full hover:bg-white/30 transition-all focus:outline-none focus:ring-2 focus:ring-white z-20"
                        aria-label="Next slide"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FaChevronRight className="text-xl" />
                    </motion.button>
                </div>

                {/* Enhanced Slide Indicators */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
                    {slides.map((_, index) => (
                        <motion.button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/70'}`}
                            aria-label={`Go to slide ${index + 1}`}
                            aria-current={index === currentSlide}
                            whileHover={{ scale: 1.2 }}
                        />
                    ))}
                </div>
            </section>

            {/* Search Bar with animation */}
            <motion.section 
                className="py-8 px-4 max-w-4xl mx-auto -mt-10 relative z-30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <motion.div 
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4"
                    whileHover={{ y: -5 }}
                >
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search plants by name or scientific name..."
                            className="w-full p-4 pr-12 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Search plants"
                        />
                        <FaLeaf className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    </div>
                </motion.div>
            </motion.section>

            {/* Enhanced Features Section with 3D animations */}
            <motion.section 
                className="py-16 px-4 max-w-7xl mx-auto" 
                aria-labelledby="features-heading"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.div className="text-center mb-12" variants={itemVariants}>
                    <h2 id="features-heading" className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
                        Professional Plant Care Tools
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Advanced features used by botanists and plant enthusiasts worldwide
                    </p>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-transparent hover:border-emerald-500/20"
                            variants={itemVariants}
                            whileHover={{ 
                                y: -10,
                                rotateZ: 1,
                                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                            }}
                        >
                            <div className="flex flex-col h-full">
                                <motion.div 
                                    className="text-4xl text-emerald-500 dark:text-emerald-400 mb-4"
                                    animate={{ 
                                        rotateY: [0, 360, 0],
                                        scale: [1, 1.2, 1]
                                    }}
                                    transition={{ 
                                        duration: 5,
                                        repeat: Infinity,
                                        repeatType: "reverse"
                                    }}
                                >
                                    {feature.icon}
                                </motion.div>
                                <h3 className="text-xl font-semibold dark:text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">{feature.desc}</p>
                                <div className="mt-auto">
                                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                                        {feature.metric}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {feature.metricDesc}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            <motion.section 
  className="py-16 px-4 bg-gray-100 dark:bg-gray-800" 
  aria-labelledby="popular-plants-heading"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
  variants={containerVariants}
>
  <div className="max-w-7xl mx-auto">
    <motion.h2 
      id="popular-plants-heading" 
      className="text-3xl font-bold text-gray-800 dark:text-white mb-12 text-center"
      variants={itemVariants}
    >
      {searchQuery ? `Search Results (${filteredPlants.length})` : 'Popular Plants'}
    </motion.h2>

    {filteredPlants.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {popularPlants.map((plant, index) => (
          <motion.div
            key={plant._id || plant.id}
            variants={cardVariants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, margin: "-50px" }}
            custom={index}
          >
            <PlantCard
              plant={plant}
              lazyLoad={true}
            />
          </motion.div>
        ))}
      </div>
    ) : (
      <motion.div 
        className="text-center py-12 bg-white dark:bg-gray-700 rounded-lg shadow mb-8"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            y: [0, -10, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <FaSeedling className="mx-auto text-5xl text-gray-400 dark:text-gray-500 mb-4" />
        </motion.div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No plants found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          {searchQuery
            ? "Try a different search term"
            : "We couldn't load any plants. Please try again later."}
        </p>
        {searchQuery && (
          <motion.button
            onClick={() => setSearchQuery('')}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Clear Search
          </motion.button>
        )}
      </motion.div>
    )}

    {/* Move View All Plants button here, below grid or no results */}
    {!searchQuery && (
      <motion.div className="text-center" variants={itemVariants}>
        <Link
          to="/all-plants"
          className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-all group"
        >
          View All Plants
          <FaChevronRight className="ml-2 transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>
    )}
  </div>
</motion.section>

            {/* Stats Section with animations */}
            <motion.section 
                className="py-16 px-4 bg-emerald-600 text-white"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { value: "10,000+", label: "Plants Tracked" },
                            { value: "95%", label: "Success Rate" },
                            { value: "24/7", label: "Support" },
                            { value: "100+", label: "Plant Species" }
                        ].map((stat, index) => (
                            <motion.div 
                                key={index}
                                className="p-6"
                                initial={{ y: 50, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                            >
                                <motion.div 
                                    className="text-4xl font-bold mb-2"
                                    whileHover={{ scale: 1.1 }}
                                >
                                    {stat.value}
                                </motion.div>
                                <div className="text-emerald-100">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Enhanced Tips Section with 3D animations */}
            <motion.section 
                className="py-16 px-4 max-w-7xl mx-auto"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <motion.div 
                        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700"
                        variants={itemVariants}
                        whileHover={{ 
                            rotateZ: 0.5,
                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                        }}
                    >
                        <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
                            <motion.span 
                                className="text-emerald-500 mr-3"
                                animate={{ rotate: 360 }}
                                transition={{ 
                                    duration: 10,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            >
                                <FaSun />
                            </motion.span>
                            Top Plant Care Mistakes
                        </h3>
                        <ul className="space-y-4">
                            {[
                                {
                                    mistake: "Overwatering",
                                    detail: "The #1 killer of houseplants. Most plants prefer to dry out between waterings.",
                                    tip: "Check soil moisture 1-2 inches deep before watering."
                                },
                                {
                                    mistake: "Insufficient Light",
                                    detail: "Plants show leggy growth or pale leaves when light-starved.",
                                    tip: "Research each plant's light requirements and rotate regularly."
                                },
                                {
                                    mistake: "Ignoring Humidity",
                                    detail: "Tropical plants often suffer in dry indoor environments.",
                                    tip: "Group plants together or use a humidifier."
                                },
                                {
                                    mistake: "Wrong Soil Type",
                                    detail: "Using garden soil for potted plants leads to compaction.",
                                    tip: "Use well-draining potting mixes specific to plant types."
                                }
                            ].map((item, index) => (
                                <motion.li 
                                    key={index} 
                                    className="border-l-4 border-emerald-500 pl-4 py-1"
                                    whileHover={{ x: 5 }}
                                >
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">{item.mistake}</h4>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{item.detail}</p>
                                    <p className="text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                                        Pro Tip: {item.tip}
                                    </p>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div 
                        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700"
                        variants={itemVariants}
                        whileHover={{ 
                            rotateZ: -0.5,
                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                        }}
                    >
                        <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
                            <motion.span 
                                className="text-emerald-500 mr-3"
                                animate={{ 
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{ 
                                    duration: 4,
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                }}
                            >
                                <FaSeedling />
                            </motion.span>
                            Beginner-Friendly Plants
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            These resilient plants are perfect for novice gardeners and can tolerate some neglect:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {beginnerPlants.length > 0 ? (
                                beginnerPlants.map((plant) => (
                                    <motion.div
                                        key={plant.id}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Link
                                            to={`/plants/${plant._id}`}
                                            className="flex items-center p-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-800/50 rounded-lg transition-colors border border-emerald-100 dark:border-emerald-800/50"
                                        >
                                            <motion.div 
                                                className="w-12 h-12 bg-white dark:bg-gray-700 rounded-md overflow-hidden mr-3"
                                                whileHover={{ rotate: 2 }}
                                            >
                                                {plant.image && (
                                                    <LazyLoadImage
                                                        src={plant.image}
                                                        alt={plant.name}
                                                        effect="blur"
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </motion.div>
                                            <div>
                                                <h4 className="font-medium text-emerald-700 dark:text-emerald-300">
                                                    {plant.name}
                                                </h4>
                                                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                                                    {plant.scientificName}
                                                </p>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div 
                                    className="col-span-2 text-center py-4 text-gray-500 dark:text-gray-400"
                                    animate={{ 
                                        x: [0, 5, -5, 0],
                                    }}
                                    transition={{ 
                                        duration: 2,
                                        repeat: Infinity,
                                        repeatType: "reverse"
                                    }}
                                >
                                    No beginner plants found
                                </motion.div>
                            )}
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
                                Quick Care Checklist:
                            </h4>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                {[
                                    "Water when top inch of soil is dry",
                                    "Bright, indirect light preferred",
                                    "Fertilize monthly during growing season"
                                ].map((item, index) => (
                                    <motion.li 
                                        key={index}
                                        className="flex items-center"
                                        whileHover={{ x: 5 }}
                                    >
                                        <motion.span 
                                            className="w-5 h-5 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mr-2"
                                            whileHover={{ scale: 1.2 }}
                                        >
                                            ✓
                                        </motion.span>
                                        {item}
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Testimonials Section with 3D effects */}
            <motion.section 
                className="py-16 px-4 bg-gray-100 dark:bg-gray-800"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-7xl mx-auto">
                    <motion.h2 
                        className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white"
                        initial={{ y: -50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        What Our Users Say
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                quote: "This app saved my fiddle leaf fig! The watering reminders are perfectly timed.",
                                author: "Sarah K., Plant Enthusiast",
                                role: "Since 2021"
                            },
                            {
                                quote: "As a professional botanist, I appreciate the scientific accuracy of the care guides.",
                                author: "Dr. Michael T., Botanist",
                                role: "PhD in Plant Biology"
                            },
                            {
                                quote: "Finally an app that understands my busy schedule but keeps my plants thriving!",
                                author: "Jamal R., Busy Professional",
                                role: "50+ plants"
                            }
                        ].map((testimonial, index) => (
                            <motion.div
                                key={index}
                                className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                                initial={{ y: 50, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                whileHover={{ 
                                    y: -10,
                                    rotateZ: 0.5
                                }}
                            >
                                <motion.div 
                                    className="text-emerald-500 text-2xl mb-4"
                                    animate={{ 
                                        scale: [1, 1.1, 1],
                                        rotate: [0, 5, -5, 0]
                                    }}
                                    transition={{ 
                                        duration: 5,
                                        repeat: Infinity,
                                        repeatType: "reverse"
                                    }}
                                >
                                    "
                                </motion.div>
                                <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                                    {testimonial.quote}
                                </p>
                                <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                                    <p className="font-semibold text-gray-800 dark:text-white">
                                        {testimonial.author}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* CTA Section with 3D animations */}
            <motion.section 
                className="py-20 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h2 
                        className="text-3xl md:text-4xl font-bold mb-6"
                        initial={{ y: -50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        Ready to Transform Your Plant Care?
                    </motion.h2>
                    <motion.p 
                        className="text-xl mb-8 text-emerald-100 max-w-3xl mx-auto"
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Join thousands of plant lovers who've brought their greenery to life with our tools.
                    </motion.p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <Link
                                to={user ? "/" : "/register"}
                                className="px-8 py-4 bg-white text-emerald-600 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
                            >
                                {user ? "Dashboard" : "Get Started Free"}
                            </Link>
                        </motion.div>
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <Link
                                to="/plant-care"
                                className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors"
                            >
                                Watch Demo
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </motion.section>
        </div>
    );
};

export default Home;