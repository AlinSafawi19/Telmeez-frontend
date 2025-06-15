import React, { useState, useEffect } from 'react';
import { translations } from '../translations';
import type { Language } from '../translations';

interface PlanFeature {
    text: string;
    included: boolean;
}

interface Plan {
    name: string;
    description: string;
    monthlyPrice: string;
    annualPrice: string;
    features: PlanFeature[];
    recommended?: boolean;
}

interface PricingPlansProps {
    initialSelectedPlan?: string | null;
    onContinue?: (selectedPlan: string, isAnnual: boolean) => void;
    language?: Language;
}

const PricingPlans: React.FC<PricingPlansProps> = ({
    initialSelectedPlan = null,
    onContinue,
    language = 'en'
}) => {
    const BILLING_PREFERENCE_KEY = 'billing_preference';
    const [isAnnual, setIsAnnual] = useState(() => {
        const savedPreference = localStorage.getItem(BILLING_PREFERENCE_KEY);
        return savedPreference ? savedPreference === 'annual' : true;
    });
    const [selectedPlan, setSelectedPlan] = useState<string | null>(() => {
        if (initialSelectedPlan) {
            return initialSelectedPlan;
        }
        return translations[language].pricing.plans.standard.name; // Default to Standard plan
    });

    const t = translations[language].pricing;
    const isRTL = language === 'ar'; // Only Arabic is RTL in our supported languages

    useEffect(() => {
        if (initialSelectedPlan) {
            setSelectedPlan(initialSelectedPlan);
        } else {
            setSelectedPlan(translations[language].pricing.plans.standard.name);
        }
    }, [language, initialSelectedPlan]);

    useEffect(() => {
        if (initialSelectedPlan) {
            setSelectedPlan(initialSelectedPlan);
        }
    }, [initialSelectedPlan]);

    const handlePlanSelect = (planName: string) => {
        setSelectedPlan(planName);
    };

    const handleContinue = () => {
        if (selectedPlan && onContinue) {
            onContinue(selectedPlan, isAnnual);
        }
    };

    const handleBillingToggle = () => {
        const newIsAnnual = !isAnnual;
        setIsAnnual(newIsAnnual);
        localStorage.setItem(BILLING_PREFERENCE_KEY, newIsAnnual ? 'annual' : 'monthly');
    };

    const plans: Plan[] = [
        {
            name: t.plans.starter.name,
            description: t.plans.starter.description,
            monthlyPrice: t.plans.starter.monthly_price,
            annualPrice: t.plans.starter.annual_price,
            features: t.plans.starter.features.map(text => ({ text, included: true })),
        },
        {
            name: t.plans.standard.name,
            description: t.plans.standard.description,
            monthlyPrice: t.plans.standard.monthly_price,
            annualPrice: t.plans.standard.annual_price,
            features: t.plans.standard.features.map(text => ({ text, included: true })),
            recommended: true,
        },
        {
            name: t.plans.enterprise.name,
            description: t.plans.enterprise.description,
            monthlyPrice: t.plans.enterprise.monthly_price,
            annualPrice: t.plans.enterprise.annual_price,
            features: t.plans.enterprise.features.map(text => ({ text, included: true })),
        },
    ];

    return (
        <div className="py-24 bg-gradient-to-b from-gray-50 to-white" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        {t.title}
                    </h2>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        {t.subtitle}
                    </p>
                    <div className="flex items-center justify-center space-x-4 p-2 inline-block">
                        <span className={`text-base px-4 py-1 rounded-full transition-all duration-300 ${!isAnnual ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-600'}`}>
                            {t.monthly}
                        </span>
                        <div className="relative">
                            <button
                                onClick={handleBillingToggle}
                                className={`w-14 h-7 rounded-full p-1 transition-all duration-300 ease-in-out focus:outline-none focus:ring-0 ${isAnnual ? 'bg-blue-600' : 'bg-gray-300'}`}
                                aria-label="Toggle billing period between monthly and annual"
                            >
                                <div
                                    className={`bg-white w-5 h-5 rounded-full shadow-lg transform transition-all duration-300 ease-in-out ${isAnnual
                                        ? isRTL
                                            ? '-translate-x-7'
                                            : 'translate-x-7'
                                        : 'translate-x-0'
                                        }`}
                                />
                            </button>
                        </div>
                        <span className={`text-base px-4 py-1 rounded-full transition-all duration-300 ${isAnnual ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-600'}`}>
                            <span className={`text-xs text-green-600 font-medium ${isRTL ? 'ml-2' : 'mr-2'}`}>{t.save_20}</span>
                            {t.annual}
                        </span>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            onClick={() => handlePlanSelect(plan.name)}
                            className={`relative rounded-xl bg-white p-5 shadow-lg cursor-pointer focus:outline-none transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${plan.recommended
                                    ? 'transform scale-[1.02] hover:scale-[1.03]'
                                    : 'border border-gray-200 hover:border-blue-200'
                                } ${selectedPlan === plan.name ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                        >
                            {plan.recommended && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-1 rounded-full text-xs font-semibold shadow-md">
                                        {t.most_popular}
                                    </span>
                                </div>
                            )}
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                <p className="text-base text-gray-600">{plan.description}</p>
                            </div>
                            <div className="text-center mb-6">
                                <div className="text-4xl font-bold text-gray-900 mb-1">
                                    {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                                    <span className="text-base font-normal text-gray-600">
                                        /{isAnnual ? t.annual.toLowerCase() : t.monthly.toLowerCase()}
                                    </span>
                                </div>
                                {isAnnual && (
                                    <p className="text-xs text-green-600 font-medium">{t.save_20}</p>
                                )}
                                {plan.name === t.plans.starter.name && (
                                    <div className="mt-2">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {t.free_trial_badge.replace('{days}', isAnnual ? '30' : '7')}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-center">
                                        <span className="mr-2 text-green-500">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </span>
                                        <span className="text-base text-gray-900">
                                            {feature.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            {selectedPlan === plan.name ? (
                                <button
                                    type="button"
                                    className="w-full py-3 px-4 rounded-lg font-semibold text-base bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    onClick={handleContinue}
                                >
                                    {t.continue_with} {plan.name}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="w-full py-3 px-4 rounded-lg font-semibold text-base transition-all duration-300 focus:outline-none bg-gray-100 text-gray-900 hover:bg-gray-200"
                                    onClick={() => handlePlanSelect(plan.name)}
                                >
                                    {plan.name === t.plans.starter.name ? t.start_free_trial : t.select_plan}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PricingPlans; 