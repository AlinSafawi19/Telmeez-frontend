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
    const [showReferralModal, setShowReferralModal] = useState(false);
    const [referralLink, setReferralLink] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        if (initialSelectedPlan) {
            setSelectedPlan(initialSelectedPlan);
        }
    }, [initialSelectedPlan]);

    useEffect(() => {
        // Generate a unique referral code (you might want to get this from your backend)
        const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        setReferralLink(`${window.location.origin}/signup?ref=${referralCode}`);
    }, []);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(referralLink);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

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

                {/* New Referral Rewards Section */}
                <div className="mt-16 max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Refer & Earn Rewards</h3>
                        <p className="text-gray-600">Share Telmeez with your network and get rewarded!</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <div className="text-blue-600 text-4xl mb-3">🎁</div>
                            <h4 className="font-semibold text-lg mb-2">Get 1 Month Free</h4>
                            <p className="text-gray-600 text-sm">When your referral subscribes to any plan</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <div className="text-blue-600 text-4xl mb-3">💎</div>
                            <h4 className="font-semibold text-lg mb-2">Extra User Seats</h4>
                            <p className="text-gray-600 text-sm">Get 2 parent seats and 5 student seats</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <div className="text-blue-600 text-4xl mb-3">🌟</div>
                            <h4 className="font-semibold text-lg mb-2">Special Discounts</h4>
                            <p className="text-gray-600 text-sm">Earn up to 20% off on your next billing cycle</p>
                        </div>
                    </div>
                    <div className="mt-8 text-center">
                        <button
                            onClick={() => setShowReferralModal(true)}
                            className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            Get Your Referral Link
                        </button>
                    </div>
                </div>

                {/* Referral Modal */}
                {showReferralModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Your Referral Link</h3>
                                <button
                                    onClick={() => setShowReferralModal(false)}
                                    className="text-gray-400 hover:text-gray-500"
                                    aria-label="Close modal"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="mb-6">
                                <p className="text-gray-600 mb-4">Share this link with your network and earn rewards when they sign up!</p>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={referralLink}
                                        readOnly
                                        aria-label="Referral link"
                                        placeholder="Your referral link"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={handleCopyLink}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        {copySuccess ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4">
                                <h4 className="font-semibold text-blue-900 mb-2">How it works:</h4>
                                <ol className="list-decimal list-inside text-blue-800 space-y-2">
                                    <li>Share your unique referral link</li>
                                    <li>When someone signs up using your link</li>
                                    <li>You both get the rewards automatically</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PricingPlans; 