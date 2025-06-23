import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { translations } from '../translations';
import type { Language } from '../translations';

interface PlanFeature {
    text: string;
    included: boolean;
}

interface Plan {
    id: string;
    name: string;
    description: string;
    monthlyPrice: string;
    annualPrice: string;
    maxStorage: string;
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
    const navigate = useNavigate();
    const BILLING_PREFERENCE_KEY = 'billing_preference';
    const SELECTED_PLAN_KEY = 'selected_plan';
    const [isAnnual, setIsAnnual] = useState(() => {
        const savedPreference = localStorage.getItem(BILLING_PREFERENCE_KEY);
        return savedPreference ? savedPreference === 'annual' : true;
    });
    const [selectedPlan, setSelectedPlan] = useState<string | null>(() => {
        if (initialSelectedPlan) {
            return initialSelectedPlan;
        }
        const savedPlan = localStorage.getItem(SELECTED_PLAN_KEY);
        return savedPlan || 'standard'; // Default to standard plan ID
    });

    const t = translations[language].pricing;
    const isRTL = language === 'ar'; // Only Arabic is RTL in our supported languages

    // Helper function to extract numeric value from price string
    const extractPrice = (priceString: string): number => {
        return parseInt(priceString.replace(/[^0-9]/g, ''), 10);
    };

    // Helper function to calculate discounted monthly price for annual billing
    const getDiscountedMonthlyPrice = (monthlyPrice: string): string => {
        const monthlyValue = extractPrice(monthlyPrice);
        const discountedMonthly = monthlyValue * 0.8; // 20% discount
        return `$${discountedMonthly.toFixed(2)}`;
    };

    // Helper function to format price display
    const formatPriceDisplay = (plan: Plan): string => {
        if (isAnnual) {
            const discountedMonthly = getDiscountedMonthlyPrice(plan.monthlyPrice);
            return discountedMonthly;
        }
        return plan.monthlyPrice;
    };

    useEffect(() => {
        if (initialSelectedPlan) {
            setSelectedPlan(initialSelectedPlan);
        } else {
            const savedPlan = localStorage.getItem(SELECTED_PLAN_KEY);
            setSelectedPlan(savedPlan || 'standard');
        }
    }, [language, initialSelectedPlan]);

    const handlePlanSelect = (planId: string) => {
        setSelectedPlan(planId);
        localStorage.setItem(SELECTED_PLAN_KEY, planId);
    };

    const handleContinue = () => {
        if (selectedPlan) {
            if (onContinue) {
                onContinue(selectedPlan, isAnnual);
            }
            // Navigate to checkout page with selected plan and billing period
            navigate(`/checkout?plan=${selectedPlan}&billing=${isAnnual ? 'annual' : 'monthly'}`);
        }
    };

    const handleBillingToggle = () => {
        const newIsAnnual = !isAnnual;
        setIsAnnual(newIsAnnual);
        localStorage.setItem(BILLING_PREFERENCE_KEY, newIsAnnual ? 'annual' : 'monthly');
    };

    const plans: Plan[] = [
        {
            id: 'starter',
            name: t.plans.starter.name,
            description: t.plans.starter.description,
            monthlyPrice: t.plans.starter.monthly_price,
            annualPrice: t.plans.starter.annual_price,
            maxStorage: t.plans.starter.max_storage,
            features: t.plans.starter.features.map(text => ({ text, included: true })),
        },
        {
            id: 'standard',
            name: t.plans.standard.name,
            description: t.plans.standard.description,
            monthlyPrice: t.plans.standard.monthly_price,
            annualPrice: t.plans.standard.annual_price,
            maxStorage: t.plans.standard.max_storage,
            features: t.plans.standard.features.map(text => ({ text, included: true })),
            recommended: true,
        },
        {
            id: 'enterprise',
            name: t.plans.enterprise.name,
            description: t.plans.enterprise.description,
            monthlyPrice: t.plans.enterprise.monthly_price,
            annualPrice: t.plans.enterprise.annual_price,
            maxStorage: t.plans.enterprise.max_storage,
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
                            key={plan.id}
                            onClick={() => handlePlanSelect(plan.id)}
                            className={`relative rounded-xl bg-white p-5 shadow-lg cursor-pointer focus:outline-none transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${plan.recommended
                                    ? 'transform scale-[1.02] hover:scale-[1.03]'
                                    : 'border border-gray-200 hover:border-blue-200'
                                } ${selectedPlan === plan.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
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
                                    {formatPriceDisplay(plan)}
                                    <span className="text-base font-normal text-gray-600">
                                        /{t.monthly.toLowerCase()}
                                    </span>
                                </div>
                                {isAnnual && (
                                    <div className="flex flex-col items-center space-y-1">
                                        <p className="text-xs text-green-600 font-medium">{t.save_20}</p>
                                        <p className="text-xs text-gray-500 line-through">
                                            {plan.monthlyPrice}/{t.monthly.toLowerCase()}
                                        </p>
                                    </div>
                                )}
                                <div className="mt-3">
                                    <div className="flex items-center justify-center space-x-2">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                                        </svg>
                                        <span className="text-sm text-gray-600 font-medium">{t.max_storage}:</span>
                                        <span className="text-sm font-semibold text-blue-600">{plan.maxStorage}</span>
                                    </div>
                                </div>
                                {plan.id === 'starter' && (
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
                            {selectedPlan === plan.id ? (
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
                                    onClick={() => handlePlanSelect(plan.id)}
                                >
                                    {plan.id === 'starter' ? t.start_free_trial : t.select_plan}
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