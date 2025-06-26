import React from 'react';
import { FaHeadset, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { MdSupportAgent } from 'react-icons/md';

const Support = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 rounded-full bg-green-100 dark:bg-green-900/50 mb-4">
                        <MdSupportAgent className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">We're Here to Help</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Have questions or need assistance? Our support team is ready to help you with any issues.
                    </p>
                </div>

                {/* Contact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {/* Email Support */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center mb-4">
                            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 mr-4">
                                <FaEnvelope className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Email Support</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Send us an email and we'll get back to you within 24 hours.
                        </p>
                        <a
                            href="mailto:support@plantpulse.com"
                            className="inline-flex items-center text-green-600 dark:text-green-400 hover:underline"
                        >
                            support@plantpulse.com
                        </a>
                    </div>

                    {/* Phone Support */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center mb-4">
                            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 mr-4">
                                <FaPhoneAlt className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Phone Support</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Call us directly during our business hours for immediate assistance.
                        </p>
                        <a
                            href="tel:+18005551234"
                            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            +1 (800) 555-1234
                        </a>
                    </div>

                    {/* Live Chat */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center mb-4">
                            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 mr-4">
                                <FaHeadset className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Live Chat</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Chat with our support agents in real-time during business hours.
                        </p>
                        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                            Start Chat
                        </button>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    {faq.question}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Our Office</h2>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <FaMapMarkerAlt className="h-5 w-5 text-green-600 dark:text-green-400 mt-1 mr-3" />
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white">Address</h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        123 Greenway Blvd<br />
                                        Portland, OR 97201<br />
                                        United States
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <FaClock className="h-5 w-5 text-green-600 dark:text-green-400 mt-1 mr-3" />
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white">Business Hours</h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Monday - Friday: 9:00 AM - 6:00 PM<br />
                                        Saturday: 10:00 AM - 4:00 PM<br />
                                        Sunday: Closed
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send Us a Message</h2>
                        <form className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="How can we help?"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Your message here..."
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

// FAQ data
const faqs = [
    {
        question: "How do I reset my password?",
        answer: "You can reset your password by clicking on the 'Forgot Password' link on the login page. We'll send you an email with instructions to create a new password."
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay for premium subscriptions."
    },
    {
        question: "How can I track my plant's growth?",
        answer: "Use our plant journal feature to log measurements and photos. Our dashboard will show you growth trends over time."
    },
    {
        question: "Is there a mobile app available?",
        answer: "Yes! PlantPulse is available for both iOS and Android devices. You can download it from the App Store or Google Play Store."
    },
    {
        question: "How do I cancel my subscription?",
        answer: "You can manage your subscription in the 'Account Settings' section. There's an option to cancel that will take effect at the end of your current billing period."
    }
];

export default Support;