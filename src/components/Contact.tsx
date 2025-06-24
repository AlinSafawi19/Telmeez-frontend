import React from 'react';
import { motion } from 'framer-motion';
import { translations } from '../translations';
import '../Landing.css';
import { useLanguage } from '../contexts/LanguageContext';

const Contact: React.FC = () => {
    const { currentLanguage } = useLanguage();
    const t = translations[currentLanguage].contact;
    const contactOptions = [
        {
            icon: "📞",
            title: t.Phone,
            description: t.speak_with_our_experts,
            action: "+961 1 234 567",
            href: "tel:+9611234567"
        },
        {
            icon: "📧",
            title: t.Email,
            description: t.send_us_message,
            action: "contact@telmeezlb.com",
            href: "mailto:contact@telmeezlb.com"
        }
    ];

    return (
        < div className="py-20 bg-gradient-to-r from-blue-600 to-blue-600 container mx-auto px-4 text-center" >
            <h2 className="text-4xl font-bold text-white mb-4">{t.Title}</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                {t.SubTitle}
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                {contactOptions.map((contact, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                        viewport={{ once: true }}
                        className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
                    >
                        <div className="text-4xl mb-4">{contact.icon}</div>
                        <h3 className="text-xl font-semibold text-white mb-2">{contact.title}</h3>
                        <p className="text-orange-100 mb-4">{contact.description}</p>
                        <a
                            href={contact.href}
                            className="text-white font-medium hover:text-orange-200 transition-colors duration-300 cursor-pointer"
                        >
                            {contact.action}
                        </a>
                    </motion.div>
                ))}
            </div>
        </div >
    )
};

export default Contact; 