import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqItems = [
        {
            question: "What is Telmeez?",
            answer: "Telmeez is a comprehensive school management system for educational institutions, colleges, and schools. It provides student management, attendance, grade book, and communication."
        },
        {
            question: "How is the pricing?",
            answer: "We have three standard pricing plans: Starter ($49/month), Standard ($99/month), and Enterprise (custom price). The plans differ in features and number of users. The yearly subscription is 20% less than the monthly subscription."
        },
        {
            question: "Is there a free trial available?",
            answer: "Yes! We offer a free trial of our Starter plan only. You can try it for 30 days if you bill yearly or 7 days if you bill monthly. That's ample time to try out all the features and see if Telmeez is right for your institution."
        },
        {
            question: "How do subscription renewals work?",
            answer: "Your subscription will automatically renew at the end of each billing period (monthly or annually). For monthly subscriptions, you'll be charged on the same date each month. For annual subscriptions, you'll be charged on the same date each year. We'll send you a reminder email 7 days before each renewal."
        },
        {
            question: "Can I cancel my subscription?",
            answer: "Yes, you can cancel your subscription at any time. You won't be charged if you cancel within your trial period. If you cancel an active subscription, you'll continue to have access until the end of your then-current billing period. No refunds are provided for partial billing periods."
        },
        {
            question: "What is your refund policy?",
            answer: "We don't give refunds for partial billing cycles. That being said, if you're experiencing technical issues that make the service impossible to use, we'll evaluate a prorated refund on a case-by-case basis."
        },
        {
            question: "How do I switch subscription plans?",
            answer: "You can always upgrade your plan, and the new rate will be prorated for the remainder of your billing cycle. If you're downgrading, the downgrade will take effect at the start of your next billing period. You can manage your subscription preferences from your account dashboard."
        },
        {
            question: "What kind of support do you provide?",
            answer: "We provide 24/7 email support for all plans. Both the Standard and Enterprise plans provide priority support with faster response times. Enterprise customers are also assigned a dedicated account manager."
        },
        {
            question: "Can I integrate Telmeez with my existing systems?",
            answer: "No, Telmeez does not and will not have API integration capabilities with other systems. We are designed as a complete, stand-alone education management solution."
        },
        {
            question: "Is my data secure?",
            answer: "Yes, we use enterprise-grade security measures like encryption of data, secure servers, and regular security audits."
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
                        Find answers to commonly asked questions about Telmeez and our services.
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