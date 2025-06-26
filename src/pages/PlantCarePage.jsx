import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaWater, 
  FaSun, 
  FaTemperatureHigh, 
  FaSeedling, 
  FaQuestionCircle,
  FaArrowRight,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import plantCareData from '../data/plantCareData'; // Assume we have this data file

const PlantCarePage = () => {
  const [activeTab, setActiveTab] = useState('basics');
  const [expandedTip, setExpandedTip] = useState(null);

  // Sample plant care data structure
  const careData = {
    basics: [
      {
        title: "Watering",
        icon: <FaWater />,
        tips: [
          "Check soil moisture 1-2 inches deep before watering",
          "Most plants prefer thorough watering until it drains from the bottom",
          "Reduce watering in winter months"
        ]
      },
      {
        title: "Light Requirements",
        icon: <FaSun />,
        tips: [
          "South-facing windows provide brightest light",
          "Rotate plants weekly for even growth",
          "Leaf burn indicates too much direct sun"
        ]
      }
    ],
    advanced: [
      {
        title: "Humidity Control",
        icon: <FaTemperatureHigh />,
        tips: [
          "Group plants together to create microclimate",
          "Use pebble trays with water under plants",
          "Mist tropical plants in morning hours"
        ]
      },
      {
        title: "Propagation",
        icon: <FaSeedling />,
        tips: [
          "Take cuttings in spring for best results",
          "Use rooting hormone for difficult plants",
          "Change water weekly for water propagation"
        ]
      }
    ]
  };

  const toggleTip = (index) => {
    setExpandedTip(expandedTip === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-16 px-4 pt-25">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Plant Care Guide</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Expert tips to keep your plants thriving through every season
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => setActiveTab('basics')}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${activeTab === 'basics' ? 'bg-white text-emerald-700' : 'bg-white/20 hover:bg-white/30'}`}
            >
              Basic Care
            </button>
            <button 
              onClick={() => setActiveTab('advanced')}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${activeTab === 'advanced' ? 'bg-white text-emerald-700' : 'bg-white/20 hover:bg-white/30'}`}
            >
              Advanced Tips
            </button>
            <button 
              onClick={() => setActiveTab('problems')}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${activeTab === 'problems' ? 'bg-white text-emerald-700' : 'bg-white/20 hover:bg-white/30'}`}
            >
              Common Problems
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        {/* Care Essentials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 flex items-center">
            <FaSeedling className="mr-3 text-emerald-500" />
            {activeTab === 'basics' ? 'Basic Care Essentials' : 
             activeTab === 'advanced' ? 'Advanced Techniques' : 'Troubleshooting Guide'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {careData[activeTab]?.map((category, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="text-2xl text-emerald-500 mr-3">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {category.title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {category.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start">
                      <span className="text-emerald-500 mr-2 mt-1">•</span>
                      <span className="text-gray-600 dark:text-gray-300">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 flex items-center">
            <FaQuestionCircle className="mr-3 text-emerald-500" />
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {plantCareData.faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                <button
                  className="w-full flex justify-between items-center p-6 text-left"
                  onClick={() => toggleTip(index)}
                  aria-expanded={expandedTip === index}
                  aria-controls={`faq-${index}`}
                >
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {faq.question}
                  </h3>
                  {expandedTip === index ? (
                    <FaChevronUp className="text-emerald-500" />
                  ) : (
                    <FaChevronDown className="text-emerald-500" />
                  )}
                </button>
                <div
                  id={`faq-${index}`}
                  className={`px-6 pb-6 pt-0 text-gray-600 dark:text-gray-300 transition-all duration-300 ${expandedTip === index ? 'block' : 'hidden'}`}
                >
                  <p>{faq.answer}</p>
                  {faq.additionalInfo && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="font-medium text-gray-800 dark:text-gray-200">Pro Tip:</p>
                      <p>{faq.additionalInfo}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plant Care Resources */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
            Ready to Deepen Your Plant Knowledge?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link 
              to="/plant-encyclopedia" 
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all group"
            >
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Plant Encyclopedia
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Browse our comprehensive plant database with care guides for hundreds of species.
              </p>
              <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
                Explore Plants <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
            <Link 
              to="/care-calendar" 
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all group"
            >
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Seasonal Care Calendar
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Never miss important plant care tasks with our month-by-month guide.
              </p>
              <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
                View Calendar <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
            <Link 
              to="/community" 
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all group"
            >
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Plant Care Community
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Connect with other plant lovers and get expert advice.
              </p>
              <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
                Join Community <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </div>

        {/* Emergency Help Section */}
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-4">
            Emergency Plant Help
          </h2>
          <p className="text-red-600 dark:text-red-300 mb-6">
            Is your plant in trouble? Here's what to do right now:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Common Symptoms:</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Yellowing leaves (overwatering or nutrient deficiency)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Brown crispy edges (underwatering or low humidity)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Drooping (could be over/underwatering or root issues)</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Immediate Actions:</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">1.</span>
                  <span>Check soil moisture immediately</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">2.</span>
                  <span>Move to appropriate light conditions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">3.</span>
                  <span>Isolate from other plants if pests are suspected</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <Link 
              to="#" 
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Get Emergency Care Guide
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlantCarePage;