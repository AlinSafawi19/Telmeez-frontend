import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqItems = [
        {
            question: "What is Telmeez?",
            answer: "Telmeez is a comprehensive educational management platform designed for schools, universities, and educational institutions. It provides tools for student management, attendance tracking, grade management, and communication."
        },
        {
            question: "How does the pricing work?",
            answer: "We offer three main pricing tiers: Starter ($49/month), Standard ($99/month), and Enterprise (custom pricing). Each plan comes with different features and user limits. Annual subscriptions offer a 20% discount compared to monthly payments."
        },
        {
            question: "Is there a free trial available?",
            answer: "Yes! We offer a free trial exclusively for our Starter plan. You can try it for 30 days with annual billing or 7 days with monthly billing. This gives you enough time to explore all features and decide if Telmeez is right for your institution."
        },
        {
            question: "How does subscription renewal work?",
            answer: "Your subscription will automatically renew at the end of each billing period (monthly or annual). For monthly plans, you'll be charged on the same date each month. For annual plans, you'll be charged on the same date each year. We'll send you a reminder email 7 days before each renewal."
        },
        {
            question: "Can I cancel my subscription?",
            answer: "Yes, you can cancel your subscription at any time. If you cancel during your trial period, you won't be charged. If you cancel an active subscription, you'll continue to have access until the end of your current billing period. No refunds are provided for partial billing periods."
        },
        {
            question: "What is your refund policy?",
            answer: "We do not provide refunds for partial billing periods. However, if you experience technical issues that prevent you from using the service, we may consider a prorated refund on a case-by-case basis."
        },
        {
            question: "How do I change my subscription plan?",
            answer: "You can upgrade your plan at any time, and the new rate will be prorated for the remainder of your billing period. When downgrading, the change will take effect at the start of your next billing cycle. You can manage your subscription settings in your account dashboard."
        },
        {
            question: "What kind of support do you provide?",
            answer: "We provide 24/7 email support for all plans. Standard and Enterprise plans include priority support with faster response times. Enterprise customers also get a dedicated account manager."
        },
        {
            question: "Can I integrate Telmeez with my existing systems?",
            answer: "No, Telmeez does not and will not offer API integration capabilities with external systems. We are designed as a complete, standalone educational management solution."
        },
        {
            question: "Is my data secure?",
            answer: "Absolutely. We use enterprise-grade security measures including data encryption, secure servers, and regular security audits."
        }
    ];

    return (
        <div id="faq-section" className="min-h-screen bg-gray-50 py-16">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mx-auto text-center mb-12"
                >
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-gray-600">
                        Find answers to common questions about Telmeez and our services.
                    </p>
                </motion.div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                    {faqItems.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className="bg-white rounded-lg shadow-sm border border-gray-100 h-fit"
                        >
                            <button
                                className="w-full px-5 py-4 text-left focus:outline-none"
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            >
                                <div className="flex justify-between items-center">
                                    <h3 className="text-base font-medium text-gray-800">{item.question}</h3>
                                    <motion.svg
                                        animate={{ rotate: openIndex === index ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="w-5 h-5 text-gray-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </motion.svg>
                                </div>
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="px-5 pb-4 overflow-hidden"
                                    >
                                        <p className="text-gray-600 text-sm leading-relaxed">{item.answer}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQ; 