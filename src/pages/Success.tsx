import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';
import logo from "../assets/images/logo.png";
import { FaCheckCircle, FaSignInAlt, FaUser, FaUsers, FaRocket } from 'react-icons/fa';
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

  const { user } = state;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl text-center"
      >
        {/* Logo */}
        <Link to="/" className="inline-block transition-transform hover:scale-105 mb-8">
          <img
            src={logo}
            alt="Telmeez Logo"
            className="h-20 w-20 sm:h-24 sm:w-24 mx-auto"
          />
        </Link>

        {/* Success Celebration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FaCheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">
            Welcome to Telmeez!
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Your account has been created successfully
          </p>
          <p className="text-lg text-gray-500">
            Welcome, {user.firstName} {user.lastName}! 🎉
          </p>
        </motion.div>

        {/* Sign In Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <button
            onClick={() => navigate('/signin')}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <FaSignInAlt className="w-5 h-5 mr-3" />
            Sign In to Your Account
          </button>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Next Steps
          </h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaUser className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 mb-1">Complete Your Profile</h3>
                <p className="text-gray-600">Set up your account preferences and personal information</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaUsers className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 mb-1">Invite Team Members</h3>
                <p className="text-gray-600">Add admins and team members to collaborate</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaRocket className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 mb-1">Start Using Telmeez</h3>
                <p className="text-gray-600">Explore all the powerful features available to you</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Support Contact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 text-gray-500"
        >
          <p>
            Need help? Contact us at{' '}
            <a href="mailto:contact@telmeezlb.com" className="text-blue-600 hover:text-blue-700 underline font-medium">
              contact@telmeezlb.com
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Success; 