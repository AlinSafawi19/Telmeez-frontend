import React from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
    return (
        <div className="min-h-screen bg-white-to-b from-white to-gray-50">
            {/* Our Story Section */}
            <section id="our-story" className="py-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl mx-auto text-center mb-16"
                    >
                        <h2 className="text-5xl font-bold text-gray-900 mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">Our Story</h2>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            Founded in 2025, Telmeez emerged from a vision to revolutionize education management through the strength of technology. Our tale began when like-minded educators and technologists came together to address the issues of today's educational institutions.
                        </p>
                    </motion.div>
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            {
                                icon: "🎯",
                                title: "Our Mission",
                                description: "Enabling education institutions with innovative technology solutions to enhance learning experiences and automate administrative processes."
                            },
                            {
                                icon: "👁️",
                                title: "Our Vision",
                                description: "We see ourselves becoming a global leader in education technology, transforming institutions' approach to managing and delivering education."
                            },
                            {
                                icon: "💎",
                                title: "Our Values",
                                description: "Innovation, integrity, and impact inspire all that we do. Excellence and constant improvement are what we're dedicated to."
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                className="bg-white p-8 rounded-xl shadow-lg transition-all duration-300 border border-gray-100"
                            >
                                <div className="text-blue-600 text-5xl mb-6 transform hover:scale-110 transition-transform duration-300">{item.icon}</div>
                                <h3 className="text-2xl font-semibold mb-4 text-gray-800">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Press Section */}
            <section id="press" className="py-20 bg-gradient-to-b from-blue-50 to-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl mx-auto text-center mb-16"
                    >
                        <h2 className="text-5xl font-bold text-gray-900 mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">Press & Media</h2>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            Stay updated with our latest news, press releases, and media coverage.
                        </p>
                    </motion.div>
                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {[
                            {
                                title: "Telmeez Announces Official Launch",
                                date: "Coming Soon",
                                source: "Telmeez Founder & CEO",
                                description: "Revolutionary educational management platform set to launch soon, poised to change how institutions approach administrative process management and enhance learning outcomes."
                            }
                        ].map((press, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="bg-white p-8 rounded-xl shadow-lg transition-all duration-300 border border-gray-100 group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-semibold text-gray-800">{press.title}</h3>
                                    <span className="text-gray-500 text-sm bg-gray-50 px-3 py-1 rounded-full">{press.date}</span>
                                </div>
                                <p className="text-blue-600 font-medium mb-4">{press.source}</p>
                                <p className="text-gray-600 mb-6">{press.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About; 