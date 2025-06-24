import { motion, LazyMotion, domAnimation } from 'framer-motion';
import { translations } from '../translations';
import { useLanguage } from '../contexts/LanguageContext';
import logo from '../assets/images/logo.png';

const AppFeatureList = ({ features, isRTL }) => (
    <ul className="space-y-3">
        {features.map((feature, index) => (
            <li key={index} className="flex items-center">
                <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${isRTL ? 'ml-3' : 'mr-3'} text-blue-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm sm:text-base text-gray-700">{feature}</span>
            </li>
        ))}
    </ul>
);

const AppDownloadButtons = ({ t }) => (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {[t.download_ios, t.download_android].map((label, i) => (
            <button
                key={label}
                type='button'
                disabled
                className="flex items-center justify-center px-4 sm:px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition transform hover:scale-105 shadow-lg focus:ring-2 focus:ring-black disabled:opacity-50 text-sm sm:text-base"
            >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d={i === 0 ? "M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" : "M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"} />
                </svg>
                {label}
            </button>
        ))}
    </div>
);

const MobileMockup = ({ isRTL, t }) => (
    <div className="relative mx-auto max-w-xs sm:max-w-sm">
        <div className="relative w-48 sm:w-64 h-[400px] sm:h-[500px] mx-auto bg-gray-900 rounded-[32px] sm:rounded-[40px] p-4 shadow-2xl">
            <div className="w-full h-full bg-white rounded-[24px] sm:rounded-[32px] overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-6 sm:h-8 bg-gray-100 flex items-center justify-center">
                    <div className="w-16 sm:w-20 h-3 sm:h-4 bg-gray-200 rounded-full"></div>
                </div>
                <div className="mt-6 sm:mt-8 p-4 flex flex-col items-center justify-center h-full">
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-white to-gray-200 rounded-2xl flex items-center justify-center mx-auto">
                            <img src={logo} alt="Telmeez Logo" className="w-10 h-10 object-contain" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">{isRTL ? 'تلميز' : 'Telmeez'}</h3>
                        <p className="text-sm text-gray-600">{t.coming_soon}</p>
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
                            <div className="w-32 h-32 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center mx-auto">
                                <div className="w-20 h-20 bg-gray-300 rounded flex items-center justify-center">
                                    <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M3,3H11V5H5V11H3V3M3,13H5V19H11V21H3V13M13,3V5H19V11H21V3H13M19,13H21V21H13V19H19V13Z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">{t.qr_description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const MobileApp = () => {
    const { currentLanguage } = useLanguage();
    const t = translations[currentLanguage].app_download;
    const isRTL = currentLanguage === 'ar';

    return (
        <LazyMotion features={domAnimation}>
            <div className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
                <div className="container mx-auto px-6 lg:px-8 relative">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="space-y-8 order-2 lg:order-1">
                            <div>
                                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    <span className="mr-2">📱</span>{t.coming_soon}
                                </span>
                                <h2 className="text-4xl font-bold text-gray-900 mt-4 leading-tight">{t.title}</h2>
                                <p className="text-xl text-gray-600 leading-relaxed">{t.subtitle}</p>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900">{t.key_features}</h3>
                                <AppFeatureList features={t.features} isRTL={isRTL} />
                            </div>
                            <AppDownloadButtons t={t} />
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }} viewport={{ once: true }} className="order-1 lg:order-2 flex justify-center">
                            <MobileMockup isRTL={isRTL} t={t} />
                        </motion.div>
                    </div>
                </div>
            </div>
        </LazyMotion>
    );
};

export default MobileApp;
