import { motion } from 'framer-motion';
import { translations } from '../translations';
import { useLanguage } from '../contexts/LanguageContext';
import logo from '../assets/images/logo.png';

const MobileApp = () => {
    const { currentLanguage } = useLanguage();
    const t = translations[currentLanguage];

    return (
        < div className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden" >
            {/* Decorative elements */}
            < div className="absolute top-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" ></div >
            <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-64 sm:w-96 h-64 sm:h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left side - Content */}
                    <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <div className="inline-block">
                                <span className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800">
                                    <span className="mr-2">📱</span>
                                    {t.app_download.coming_soon}
                                </span>
                            </div>
                            <h2 className="text-4xl font-bold text-gray-900 mt-4 leading-tight">
                                {t.app_download.title}
                            </h2>
                            <p className="text-xl text-gray-600 leading-relaxed">
                                {t.app_download.subtitle}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="space-y-4"
                        >
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">{t.app_download.key_features}</h3>
                            <ul className="space-y-3">
                                {t.app_download.features.map((feature, index) => (
                                    <li key={index} className="flex items-center">
                                        <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${currentLanguage === 'ar' ? 'ml-3' : 'mr-3'} text-blue-600 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-sm sm:text-base text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                        >
                            <button
                                type='button'
                                className="flex items-center justify-center px-4 sm:px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                disabled
                            >
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                </svg>
                                {t.app_download.download_ios}
                            </button>
                            <button
                                type='button'
                                className="flex items-center justify-center px-4 sm:px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                disabled
                            >
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                                </svg>
                                {t.app_download.download_android}
                            </button>
                        </motion.div>
                    </div>

                    {/* Right side - Mobile mockup and QR code */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="relative order-1 lg:order-2 flex justify-center"
                    >
                        <div className="relative mx-auto max-w-xs sm:max-w-sm">
                            {/* Mobile phone mockup */}
                            <div className="relative w-48 sm:w-64 h-[400px] sm:h-[500px] mx-auto bg-gray-900 rounded-[32px] sm:rounded-[40px] p-3 sm:p-4 shadow-2xl">
                                <div className="w-full h-full bg-white rounded-[24px] sm:rounded-[32px] overflow-hidden relative">
                                    {/* Status bar */}
                                    <div className="absolute top-0 left-0 right-0 h-6 sm:h-8 bg-gray-100 flex items-center justify-center">
                                        <div className="w-16 sm:w-20 h-3 sm:h-4 bg-gray-200 rounded-full"></div>
                                    </div>

                                    {/* App content */}
                                    <div className="mt-6 sm:mt-8 p-3 sm:p-4 flex flex-col items-center justify-center h-full">
                                        <div className="text-center space-y-3 sm:space-y-4">
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-white to-gray-200 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto">
                                                <img
                                                    src={logo}
                                                    alt="Telmeez Logo"
                                                    className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                                                />
                                            </div>
                                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">{currentLanguage === 'ar' ? 'تلميز' : 'Telmeez'}</h3>
                                            <p className="text-xs sm:text-sm text-gray-600 text-center">
                                                {t.app_download.coming_soon}
                                            </p>

                                            {/* QR Code placeholder */}
                                            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                                                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center mx-auto">
                                                    <div className="text-center">
                                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-300 rounded flex items-center justify-center mx-auto mb-2">
                                                            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M3,3H11V5H5V11H3V3M3,13H5V19H11V21H3V13M13,3V5H19V11H21V3H13M19,13H21V21H13V19H19V13Z" />
                                                            </svg>
                                                        </div>
                                                        <p className="text-xs text-gray-500">{t.app_download.scan_qr}</p>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-500 text-center mt-2">
                                                    {t.app_download.qr_description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating elements */}
                            <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full animate-bounce"></div>
                            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-500 rounded-full animate-bounce animation-delay-1000"></div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div >
    )
}

export default MobileApp;