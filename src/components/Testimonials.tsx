import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../Landing.css';
import { testimonialService } from '../services/testimonialService';
import type { Testimonial, TestimonialForm } from '../services/testimonialService';
import { translations } from '../translations';
import { useLanguage } from '../contexts/LanguageContext';

interface TestimonialFormErrors {
    name?: string;
    position?: string;
    institution?: string;
    quote?: string;
    email?: string;
}

const Testimonials: React.FC = () => {
    const { currentLanguage } = useLanguage();
    const t = translations[currentLanguage];

    // Testimonial states
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
    const [testimonialForm, setTestimonialForm] = useState<TestimonialForm>({
        name: '',
        position: '',
        institution: '',
        quote: '',
        email: ''
    });
    const [testimonialFormErrors, setTestimonialFormErrors] = useState<TestimonialFormErrors>({});
    const [isLoadingTestimonials, setIsLoadingTestimonials] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);

    // Scroll to pricing section function
    const scrollToPricingSection = useCallback(() => {
        setIsScrolling(true);
        const pricingSection = document.querySelector('[data-section="pricing"]');
        if (pricingSection) {
            pricingSection.scrollIntoView({ behavior: 'smooth' });
        }
        setTimeout(() => setIsScrolling(false), 1000);
    }, []);

    const validateEmail = useCallback((email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }, []);

    // Optimized testimonial form handlers
    const handleTestimonialFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTestimonialForm(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const validateTestimonialForm = useCallback((): boolean => {
        const errors: TestimonialFormErrors = {};
        let isValid = true;

        if (!testimonialForm.name.trim()) {
            errors.name = t.testimonials.modal.errors.email_required;
            isValid = false;
        }

        if (!testimonialForm.position.trim()) {
            errors.position = t.testimonials.modal.errors.position_required;
            isValid = false;
        }

        if (!testimonialForm.institution.trim()) {
            errors.institution = t.testimonials.modal.errors.institution_required;
            isValid = false;
        }

        if (!testimonialForm.quote.trim()) {
            errors.quote = t.testimonials.modal.errors.quote_required;
            isValid = false;
        }

        if (!testimonialForm.email.trim()) {
            errors.email = t.testimonials.modal.errors.email_required;
            isValid = false;
        } else if (!validateEmail(testimonialForm.email)) {
            errors.email = t.testimonials.modal.errors.invalid_email;
            isValid = false;
        }

        setTestimonialFormErrors(errors);
        return isValid;
    }, [testimonialForm, t.testimonials.modal.errors, validateEmail]);

    // Fetch testimonials on component mount
    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            console.log('🔍 Fetching latest testimonials from API...');
            setIsLoadingTestimonials(true);

            const response = await testimonialService.getLatestTestimonials();

            if (response.success && response.data) {
                console.log('✅ Testimonials fetched successfully:', response.data);
                setTestimonials(response.data);
            } else {
                console.log('❌ Failed to fetch testimonials:', response.message);
            }
        } catch (error) {
            console.error('❌ Error fetching testimonials:', error);
        } finally {
            setIsLoadingTestimonials(false);
        }
    };


    const handleTestimonialSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateTestimonialForm()) {
            console.log('❌ Form validation failed');
            return;
        }

        try {
            console.log('🔄 Submitting testimonial...', testimonialForm);

            const response = await testimonialService.submitTestimonial(testimonialForm);

            if (response.success) {
                console.log('✅ Testimonial submitted successfully!', response.data);

                // Reset form
                setTestimonialForm({
                    name: '',
                    position: '',
                    institution: '',
                    quote: '',
                    email: ''
                });
                setTestimonialFormErrors({});
                setIsTestimonialModalOpen(false);

                // Refresh testimonials to show the new one (if approved)
                fetchTestimonials();
            } else {
                console.log('❌ Testimonial submission failed:', response.message);
            }
        } catch (error) {
            console.error('❌ Testimonial submission error:', error);
        }
    }, [testimonialForm, validateTestimonialForm, fetchTestimonials]);

    const handleCloseTestimonialModal = useCallback(() => {
        setIsTestimonialModalOpen(false);
        setTestimonialFormErrors({});
    }, []);

    return (
        <>
            {/* Testimonials Section */}
            < div id="testimonials" className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden" >
                {/* Enhanced decorative elements */}
                < div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" ></div >
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

                <div className="container mx-auto px-4 relative">
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-5xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                {testimonials.length > 0 ? t.testimonials.hasfeedbacks.title : t.testimonials.nofeedbacks.title}
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                {testimonials.length > 0
                                    ? t.testimonials.hasfeedbacks.subtitle
                                    : t.testimonials.nofeedbacks.subtitle}
                            </p>
                            <button
                                onClick={() => setIsTestimonialModalOpen(true)}
                                className="mt-8 inline-flex items-center px-6 py-3 rounded-lg text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                <svg className={`w-5 h-5 ${currentLanguage === 'ar' ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                {t.testimonials.modal.title}
                            </button>
                        </motion.div>
                    </div>

                    {isLoadingTestimonials ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="flex justify-center items-center py-12"
                        >
                            <div className="flex items-center space-x-2">
                                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="text-gray-600">Loading testimonials...</span>
                            </div>
                        </motion.div>
                    ) : testimonials.length >= 3 ? (
                        <div className="grid md:grid-cols-3 gap-8">
                            {testimonials.slice(-3).map((testimonial, index) => (
                                <motion.div
                                    key={testimonial._id || index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    viewport={{ once: true }}
                                    whileHover={{ scale: 1.02 }}
                                    className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100 transform transition-all duration-300 hover:shadow-2xl relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative">
                                        <div className="flex items-center mb-6">
                                            <div className="relative">
                                                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                                    {testimonial.initials}
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <h4 className="text-lg font-semibold text-gray-900">{testimonial.name}</h4>
                                                <p className="text-gray-600">{testimonial.position}</p>
                                                <p className="text-sm text-blue-600 font-medium">{testimonial.institution}</p>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <svg className="absolute -top-4 -left-4 w-8 h-8 text-blue-200 transform group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 32 32">
                                                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                                            </svg>
                                            <p className="text-gray-600 italic mb-4 pl-4 group-hover:text-gray-900 transition-colors duration-300">
                                                {testimonial.quote}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg key={i} className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm text-gray-500">
                                                    {new Date(testimonial.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="max-w-6xl mx-auto"
                        >
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                {/* Left side - Main content */}
                                <div className="space-y-6">
                                    <div className="inline-block">
                                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                            <span className="mr-2">✨</span>
                                            {t.testimonials.nofeedbacks.left.tag}
                                        </span>
                                    </div>
                                    <h3 className="text-3xl font-bold text-gray-900 leading-tight">
                                        {t.testimonials.nofeedbacks.left.offer}
                                    </h3>
                                    <p className="text-lg text-gray-600">
                                        {t.testimonials.nofeedbacks.left.description}
                                    </p>
                                    <div className="flex flex-col space-y-4">
                                        <div className={`flex items-start ${currentLanguage === 'ar' ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                                            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <span className="text-2xl">🎯</span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{t.testimonials.nofeedbacks.left.benifets.title}</h4>
                                                <ul className="text-gray-600 space-y-2 mt-2">
                                                    <li className="flex items-center">
                                                        <svg className={`w-4 h-4 ${currentLanguage === 'ar' ? 'ml-2' : 'mr-2'} text-blue-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        {t.testimonials.nofeedbacks.left.benifets.ben1}
                                                    </li>
                                                    <li className="flex items-center">
                                                        <svg className={`w-4 h-4 ${currentLanguage === 'ar' ? 'ml-2' : 'mr-2'} text-blue-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        {t.testimonials.nofeedbacks.left.benifets.ben2}
                                                    </li>
                                                    <li className="flex items-center">
                                                        <svg className={`w-4 h-4 ${currentLanguage === 'ar' ? 'ml-2' : 'mr-2'} text-blue-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        {t.testimonials.nofeedbacks.left.benifets.ben3}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className={`flex items-start ${currentLanguage === 'ar' ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                                            <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                                <span className="text-2xl">💡</span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{t.testimonials.nofeedbacks.left.shape_your_future}</h4>
                                                <p className="text-gray-600">{t.testimonials.nofeedbacks.left.shape_your_future_desc}</p>
                                            </div>
                                        </div>
                                        <div className={`flex items-start ${currentLanguage === 'ar' ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                                            <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                                                <span className="text-2xl">🌟</span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{t.testimonials.nofeedbacks.left.recog}</h4>
                                                <p className="text-gray-600">{t.testimonials.nofeedbacks.left.recog_desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-4">
                                        <button
                                            onClick={scrollToPricingSection}
                                            className="inline-flex items-center px-6 py-3 rounded-lg text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        >
                                            {t.testimonials.nofeedbacks.left.button}
                                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Right side - Visual elements */}
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl transform rotate-3"></div>
                                    <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                                        <div className="space-y-6">
                                            <div className={`flex items-center ${currentLanguage === 'ar' ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                                    1
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{t.testimonials.nofeedbacks.right.info1.title}</h4>
                                                    <p className="text-sm text-gray-600">{t.testimonials.nofeedbacks.right.info1.subtitle}</p>
                                                </div>
                                            </div>
                                            <div className="h-8 w-0.5 bg-gradient-to-b from-blue-400 to-purple-400 mx-6"></div>
                                            <div className={`flex items-center ${currentLanguage === 'ar' ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                                                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                                    2
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{t.testimonials.nofeedbacks.right.info2.title}</h4>
                                                    <p className="text-sm text-gray-600">{t.testimonials.nofeedbacks.right.info2.subtitle}</p>
                                                </div>
                                            </div>
                                            <div className="h-8 w-0.5 bg-gradient-to-b from-purple-400 to-pink-400 mx-6"></div>
                                            <div className={`flex items-center ${currentLanguage === 'ar' ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                                                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                                    3
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{t.testimonials.nofeedbacks.right.info3.title}</h4>
                                                    <p className="text-sm text-gray-600">{t.testimonials.nofeedbacks.right.info3.subtitle}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-8 pt-6 border-t border-gray-100">
                                            <div className="flex items-center justify-between">
                                                <div className={`flex ${currentLanguage === 'ar' ? 'space-x-reverse -space-x-2' : '-space-x-2'}`}>
                                                    {[...Array(3)].map((_, i) => (
                                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm">
                                                            {i === 0 ? t.testimonials.nofeedbacks.right.pioneers.first :
                                                                i === 1 ? t.testimonials.nofeedbacks.right.pioneers.second :
                                                                    t.testimonials.nofeedbacks.right.pioneers.third}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-4 text-center">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {t.testimonials.nofeedbacks.right.tag}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div >
            {/* Add Testimonial Modal */}
            <AnimatePresence>
                {isTestimonialModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        {t.testimonials.modal.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">{t.testimonials.modal.subtitle}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCloseTestimonialModal}
                                    className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors duration-200 p-2 hover:bg-gray-100 rounded-md force-white-bg"
                                    aria-label="Close testimonial modal"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="group">
                                        <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors duration-200">
                                            {t.testimonials.modal.form.name}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={testimonialForm.name}
                                                onChange={handleTestimonialFormChange}
                                                className={`w-full text-sm rounded-xl border force-white-bg ${testimonialFormErrors.name ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md ${currentLanguage === 'ar' ? 'pl-3 pr-10' : 'pr-3 pl-10'} py-2`}
                                                placeholder={t.testimonials.modal.form.name_placeholder}
                                            />
                                            <div className={`absolute inset-y-0 ${currentLanguage === 'ar' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                                                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                        </div>
                                        {testimonialFormErrors.name && (
                                            <p className="mt-1 text-xs text-red-500">{testimonialFormErrors.name}</p>
                                        )}
                                    </div>
                                    <div className="group">
                                        <label htmlFor="position" className="block text-xs font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors duration-200">
                                            {t.testimonials.modal.form.position}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                id="position"
                                                name="position"
                                                value={testimonialForm.position}
                                                onChange={handleTestimonialFormChange}
                                                className={`w-full text-sm rounded-xl border force-white-bg ${testimonialFormErrors.position ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md ${currentLanguage === 'ar' ? 'pl-3 pr-10' : 'pr-3 pl-10'} py-2`}
                                                placeholder={t.testimonials.modal.form.position_placeholder}
                                            />
                                            <div className={`absolute inset-y-0 ${currentLanguage === 'ar' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                                                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        {testimonialFormErrors.position && (
                                            <p className="mt-1 text-xs text-red-500">{testimonialFormErrors.position}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="group">
                                        <label htmlFor="institution" className="block text-xs font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors duration-200">
                                            {t.testimonials.modal.form.institution}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                id="institution"
                                                name="institution"
                                                value={testimonialForm.institution}
                                                onChange={handleTestimonialFormChange}
                                                className={`w-full text-sm rounded-xl border force-white-bg ${testimonialFormErrors.institution ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md ${currentLanguage === 'ar' ? 'pl-3 pr-10' : 'pr-3 pl-10'} py-2`}
                                                placeholder={t.testimonials.modal.form.institution_placeholder}
                                            />
                                            <div className={`absolute inset-y-0 ${currentLanguage === 'ar' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                                                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                        </div>
                                        {testimonialFormErrors.institution && (
                                            <p className="mt-1 text-xs text-red-500">{testimonialFormErrors.institution}</p>
                                        )}
                                    </div>
                                    <div className="group">
                                        <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors duration-200">
                                            {t.testimonials.modal.form.email}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                id="email"
                                                name="email"
                                                value={testimonialForm.email}
                                                onChange={handleTestimonialFormChange}
                                                className={`w-full text-sm rounded-xl border force-white-bg ${testimonialFormErrors.email ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md ${currentLanguage === 'ar' ? 'pl-3 pr-10' : 'pr-3 pl-10'} py-2`}
                                                placeholder="john@example.com"
                                            />
                                            <div className={`absolute inset-y-0 ${currentLanguage === 'ar' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                                                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        {testimonialFormErrors.email && (
                                            <p className="mt-1 text-xs text-red-500">{testimonialFormErrors.email}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="group">
                                    <label htmlFor="quote" className="block text-xs font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors duration-200">
                                        {t.testimonials.modal.form.quote}
                                    </label>
                                    <div className="relative">
                                        <textarea
                                            id="quote"
                                            name="quote"
                                            value={testimonialForm.quote}
                                            onChange={handleTestimonialFormChange}
                                            rows={4}
                                            className={`w-full text-sm rounded-xl border force-white-bg ${testimonialFormErrors.quote ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md resize-none ${currentLanguage === 'ar' ? 'pl-3 pr-10' : 'pr-3 pl-10'} py-2`}
                                            placeholder={t.testimonials.modal.form.quote_placeholder}
                                        />
                                        <div className={`absolute top-2 ${currentLanguage === 'ar' ? 'right-2' : 'left-2'} pointer-events-none`}>
                                            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                            </svg>
                                        </div>
                                    </div>
                                    {testimonialFormErrors.quote && (
                                        <p className="mt-1 text-xs text-red-500">{testimonialFormErrors.quote}</p>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={handleCloseTestimonialModal}
                                        className={`px-4 py-2 text-sm text-gray-700 hover:text-gray-900 focus:outline-none transition-colors duration-200 font-medium force-white-bg ${currentLanguage === 'ar' ? 'ml-3' : 'mr-3'}`}
                                    >
                                        {t.testimonials.modal.form.cancel}
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                    >
                                        {t.testimonials.modal.form.submit}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add loading overlay for smooth scrolling */}
            {isScrolling && (
                <div className="fixed inset-0 bg-black bg-opacity-10 z-40 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                </div>
            )}
        </>
    );
};

export default Testimonials; 