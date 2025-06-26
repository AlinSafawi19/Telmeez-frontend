import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';
import logo from "../assets/images/logo.png";
import { FaCheckCircle, FaHome, FaUser } from 'react-icons/fa';
import '../Landing.css';

interface SuccessState {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  subscription: {
    id: string;
    plan: string;
    status: string;
    billingCycle: string;
    totalAmount: number;
    trialEnd?: string;
  };
}

const Success: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';

  // Get data from navigation state
  const state = location.state as SuccessState;

  // If no state data, redirect to home
  if (!state) {
    React.useEffect(() => {
      navigate('/');
    }, [navigate]);
    return null;
  }

  const { user, subscription } = state;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block transition-transform hover:scale-105 mb-6">
            <img
              src={logo}
              alt="Company Logo"
              className="h-16 w-16 sm:h-20 sm:w-20 mx-auto"
            />
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">
            Welcome to Telmeez!
          </h1>
          <p className="text-lg text-gray-600">
            Your account has been created successfully
          </p>
        </div>

        {/* Success Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-900 mb-2">
              Account Created Successfully!
            </h2>
            <p className="text-green-700">
              Welcome, {user.firstName} {user.lastName}!
            </p>
          </div>

          {/* Account Details */}
          <div className="p-6 space-y-6">
            {/* User Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaUser className="w-5 h-5 mr-2 text-blue-600" />
                Account Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Subscription Information */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Subscription Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Plan</p>
                  <p className="font-medium text-gray-900">{subscription.plan}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Billing Cycle</p>
                  <p className="font-medium text-gray-900 capitalize">{subscription.billingCycle}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-medium text-gray-900 capitalize">{subscription.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-medium text-gray-900">${subscription.totalAmount.toFixed(2)}</p>
                </div>
              </div>
              {subscription.trialEnd && subscription.plan.toLowerCase() === 'starter' && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Trial Period:</strong> Your trial ends on {new Date(subscription.trialEnd).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            {/* Next Steps */}
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Next Steps
              </h3>
              <ul className="space-y-2 text-green-800">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Complete your profile setup</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Invite Admins</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Start using Telmeez features</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-6 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <FaHome className="w-5 h-5 mr-2" />
                Go to Home
              </button>
              <button
                onClick={() => navigate('/signin')}
                className="flex-1 flex items-center justify-center px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                <FaUser className="w-5 h-5 mr-2" />
                Sign In
              </button>
            </div>
          </div>
        </motion.div>

        {/* Support Information */}
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-2">
            Need help getting started?
          </p>
          <p className="text-gray-600">
            Contact our support team at 
            <a href="mailto:contact@telmeezlb.com" className="text-blue-600 hover:text-blue-700 underline ml-1">
              contact@telmeezlb.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Success; 