import React, { useState, useEffect } from 'react';

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
}

const plans: Plan[] = [
    {
        name: 'Starter',
        description: 'Perfect for small schools and tutoring centers',
        monthlyPrice: '$49',
        annualPrice: '$470',
        features: [
            { text: '3 Admin Accounts', included: true },
            { text: '25 Teacher Accounts', included: true },
            { text: '250 Student Accounts', included: true },
            { text: '125 Parent Accounts', included: true },
        ],
    },
    {
        name: 'Standard',
        description: 'Best for growing educational institutions',
        monthlyPrice: '$99',
        annualPrice: '$950',
        features: [
            { text: '10 Admin Accounts', included: true },
            { text: '150 Teacher Accounts', included: true },
            { text: '1,500 Student Accounts', included: true },
            { text: '750 Parent Accounts', included: true },
        ],
        recommended: true,
    },
    {
        name: 'Enterprise',
        description: 'For large institutions with advanced needs',
        monthlyPrice: '$299',
        annualPrice: '$2,870',
        features: [
            { text: 'Unlimited Admin Accounts', included: true },
            { text: 'Unlimited Teacher Accounts', included: true },
            { text: 'Unlimited Student Accounts', included: true },
            { text: 'Unlimited Parent Accounts', included: true }
        ],
    },
];

const PricingPlans: React.FC<PricingPlansProps> = ({ initialSelectedPlan = null, onContinue }) => {
    const [isAnnual, setIsAnnual] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(() => {
        if (initialSelectedPlan) {
            return initialSelectedPlan;
        }
        const recommendedPlan = plans.find(plan => plan.recommended);
        return recommendedPlan ? recommendedPlan.name : null;
    });

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

    return (
        <div className="py-24 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Choose Your Plan
                    </h2>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        Select the perfect plan for your institution and start transforming your educational experience today
                    </p>
                    <div className="flex items-center justify-center space-x-4 p-2 inline-block">
                        <span className={`text-base px-4 py-1 rounded-full transition-all duration-300 ${!isAnnual ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-600'}`}>
                            Monthly
                        </span>
                        <div className="relative">
                            <button
                                onClick={() => setIsAnnual(!isAnnual)}
                                className={`w-14 h-7 rounded-full p-1 transition-all duration-300 ease-in-out focus:outline-none focus:ring-0 ${isAnnual ? 'bg-blue-600' : 'bg-gray-300'
                                    }`}
                                aria-label="Toggle billing period between monthly and annual"
                            >
                                <div
                                    className={`bg-white w-5 h-5 rounded-full shadow-lg transform transition-all duration-300 ease-in-out ${isAnnual ? 'translate-x-7' : 'translate-x-0'
                                        }`}
                                />
                            </button>
                        </div>
                        <span className={`text-base px-4 py-1 rounded-full transition-all duration-300 ${isAnnual ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-600'}`}>
                            Annual
                            <span className="ml-2 text-xs text-green-600 font-medium">Save 20%</span>
                        </span>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            onClick={() => handlePlanSelect(plan.name)}
                            className={`relative rounded-xl bg-white p-5 shadow-lg cursor-pointer focus:outline-none ${plan.recommended
                                ? 'transform scale-[1.02]'
                                : 'border border-gray-200'
                                } ${selectedPlan === plan.name ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                        >
                            {plan.recommended && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-1 rounded-full text-xs font-semibold shadow-md">
                                        Most Popular
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
                                    {plan.monthlyPrice !== 'Premium' && (
                                        <span className="text-base font-normal text-gray-600">
                                            /{isAnnual ? 'year' : 'month'}
                                        </span>
                                    )}
                                </div>
                                {plan.monthlyPrice !== 'Premium' && isAnnual && (
                                    <p className="text-xs text-green-600 font-medium">Save 20% with annual billing</p>
                                )}
                                {plan.name === 'Starter' && (
                                    <div className="mt-2">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            <span className="mr-1">✨</span>
                                            {isAnnual ? '30-day' : '7-day'} free trial
                                        </span>
                                    </div>
                                )}
                            </div>
                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-center">
                                        <span
                                            className={`mr-2 ${feature.included ? 'text-green-500' : 'text-gray-400'
                                                }`}
                                        >
                                            {feature.included ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            )}
                                        </span>
                                        <span className={`text-base ${feature.included ? 'text-gray-900' : 'text-gray-500'}`}>
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
                                    Continue with {plan.name}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className={`w-full py-3 px-4 rounded-lg font-semibold text-base transition-all duration-300 focus:outline-none ${plan.name === 'Starter' ? 'bg-gray-100 text-gray-900 hover:bg-gray-200' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
                                    onClick={() => handlePlanSelect(plan.name)}
                                >
                                    {plan.name === 'Starter' ? 'Start Free Trial' : 'Select Plan'}
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