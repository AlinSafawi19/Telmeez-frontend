import { useState, useEffect } from 'react';
import SubscriberDashboardLayout from './SubscriberDashboardLayout';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Select2 from '../../../components/Select2';
import { useUser } from '../../../contexts/UserContext';

import {
    UserCircleIcon,
    ShieldCheckIcon,
    EyeIcon,
    EyeSlashIcon,
    CameraIcon,
    PencilIcon,
    KeyIcon,
    CalendarIcon,
    StarIcon,
    MapPinIcon
} from '@heroicons/react/24/outline';

const Account: React.FC = () => {
    const { subscriber, isLoading, error } = useUser();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // Form states
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        institution: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        country: ''
    });

    const [securityData, setSecurityData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Debug logging
    useEffect(() => {
        console.log('Account component state:', {
            subscriber: subscriber,
            isLoading: isLoading,
            error: error,
            profileData: profileData
        });
    }, [subscriber, isLoading, error, profileData]);

    // Update profile data when subscriber data changes
    useEffect(() => {
        console.log('Account component - subscriber data changed:', subscriber);
        if (subscriber) {
            setProfileData({
                firstName: subscriber.user?.first_name || '',
                lastName: subscriber.user?.last_name || '',
                email: subscriber.user?.email || '',
                phone: subscriber.user?.phone || '',
                institution: subscriber.institution_name || '',
                address1: subscriber.user?.primary_address || '',
                address2: subscriber.user?.secondary_address || '',
                city: subscriber.user?.city || '',
                state: subscriber.user?.state || '',
                zip: subscriber.user?.zip || '',
                country: subscriber.user?.country || ''
            });
            console.log('Account component - profile data updated:', {
                firstName: subscriber.user?.first_name || '',
                lastName: subscriber.user?.last_name || '',
                email: subscriber.user?.email || '',
                phone: subscriber.user?.phone || '',
                institution: subscriber.institution_name || '',
                address1: subscriber.user?.primary_address || '',
                address2: subscriber.user?.secondary_address || '',
                city: subscriber.user?.city || '',
                state: subscriber.user?.state || '',
                zip: subscriber.user?.zip || '',
                country: subscriber.user?.country || ''
            });
        }
    }, [subscriber]);

    const tabs = [
        { id: 'profile', name: 'Profile', icon: UserCircleIcon, color: 'text-blue-500' },
        { id: 'security', name: 'Security', icon: ShieldCheckIcon, color: 'text-red-500' },
        { id: 'address', name: 'Address', icon: MapPinIcon, color: 'text-green-500' },
    ];

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async () => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            Swal.fire({
                icon: 'success',
                title: 'Profile Updated!',
                text: 'Your profile information has been successfully updated.',
                timer: 2000,
                showConfirmButton: false
            });

            setIsEditing(false);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'There was an error updating your profile. Please try again.'
            });
        }
    };

    const handlePasswordChange = async () => {
        if (securityData.newPassword !== securityData.confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Password Mismatch',
                text: 'New password and confirm password do not match.'
            });
            return;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            Swal.fire({
                icon: 'success',
                title: 'Password Changed!',
                text: 'Your password has been successfully updated.',
                timer: 2000,
                showConfirmButton: false
            });

            setSecurityData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Password Change Failed',
                text: 'There was an error changing your password. Please try again.'
            });
        }
    };

    const renderProfileTab = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            {previewImage ? (
                                <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : subscriber?.profileImage?.file_url ? (
                                <img src={subscriber.profileImage.file_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-white text-2xl font-bold">
                                    {subscriber?.user?.first_name?.[0]}{subscriber?.user?.last_name?.[0]}
                                </span>
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50">
                            <CameraIcon className="w-4 h-4 text-gray-600" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                aria-label="Upload profile image"
                            />
                        </label>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {subscriber?.user?.first_name} {subscriber?.user?.last_name}
                        </h2>
                        <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                                <CalendarIcon className="w-4 h-4 mr-1" />
                                Member since {new Date(subscriber?.createdAt || '').toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                                <StarIcon className="w-4 h-4 mr-1 text-yellow-500" />
                                {subscriber?.role?.name}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none"
                    >
                        <PencilIcon className="w-4 h-4" />
                        <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                    </button>
                </div>
            </div>

            {/* Profile Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        <input
                            type="text"
                            value={profileData.firstName}
                            onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                            placeholder="Enter first name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <input
                            type="text"
                            value={profileData.lastName}
                            onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                            placeholder="Enter last name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                            placeholder="Enter email address"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                            placeholder="Enter phone number"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
                        <input
                            type="text"
                            value={profileData.institution}
                            onChange={(e) => setProfileData(prev => ({ ...prev, institution: e.target.value }))}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                            placeholder="Enter institution name"
                        />
                    </div>
                </div>

                {isEditing && (
                    <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors focus:outline-none border-none"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveProfile}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none"
                        >
                            Save Changes
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );

    const renderSecurityTab = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Password Change */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <KeyIcon className="w-5 h-5 mr-2 text-red-500" />
                    Change Password
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={securityData.currentPassword}
                                onChange={(e) => setSecurityData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter current password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none border-none bg-transparent"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <EyeSlashIcon className="w-4 h-4 text-gray-400" />
                                ) : (
                                    <EyeIcon className="w-4 h-4 text-gray-400" />
                                )}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                value={securityData.newPassword}
                                onChange={(e) => setSecurityData(prev => ({ ...prev, newPassword: e.target.value }))}
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none border-none bg-transparent"
                                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                            >
                                {showNewPassword ? (
                                    <EyeSlashIcon className="w-4 h-4 text-gray-400" />
                                ) : (
                                    <EyeIcon className="w-4 h-4 text-gray-400" />
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={securityData.confirmPassword}
                                onChange={(e) => setSecurityData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Confirm new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none border-none bg-transparent"
                                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                            >
                                {showConfirmPassword ? (
                                    <EyeSlashIcon className="w-4 h-4 text-gray-400" />
                                ) : (
                                    <EyeIcon className="w-4 h-4 text-gray-400" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
                <button
                    onClick={handlePasswordChange}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors focus:outline-none border-none"
                >
                    Change Password
                </button>
            </div>
        </motion.div>
    );

    const renderAddressTab = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Address Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <MapPinIcon className="w-5 h-5 mr-2 text-green-500" />
                        Address Information
                    </h3>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors focus:outline-none border-none"
                    >
                        <PencilIcon className="w-4 h-4" />
                        <span>{isEditing ? 'Cancel' : 'Edit Address'}</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1</label>
                        <input
                            type="text"
                            value={profileData.address1}
                            onChange={(e) => setProfileData(prev => ({ ...prev, address1: e.target.value }))}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                            placeholder="Enter primary address"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
                        <input
                            type="text"
                            value={profileData.address2}
                            onChange={(e) => setProfileData(prev => ({ ...prev, address2: e.target.value }))}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                            placeholder="Enter secondary address (optional)"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                            type="text"
                            value={profileData.city}
                            onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                            placeholder="Enter city"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
                        <input
                            type="text"
                            value={profileData.state}
                            onChange={(e) => setProfileData(prev => ({ ...prev, state: e.target.value }))}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                            placeholder="Enter state or province"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ZIP/Postal Code</label>
                        <input
                            type="text"
                            value={profileData.zip}
                            onChange={(e) => setProfileData(prev => ({ ...prev, zip: e.target.value }))}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                            placeholder="Enter ZIP or postal code"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        <input
                            type="text"
                            value={profileData.country}
                            onChange={(e) => setProfileData(prev => ({ ...prev, country: e.target.value }))}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                            placeholder="Enter country"
                        />
                    </div>
                </div>

                {isEditing && (
                    <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors focus:outline-none border-none"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveProfile}
                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors focus:outline-none border-none"
                        >
                            Save Address
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );

    return (
        <SubscriberDashboardLayout>
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
                    <p className="text-gray-600 mt-2">Manage your profile, security, and preferences</p>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading account information...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Error loading account data</h3>
                                <p className="text-sm text-red-700 mt-1">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content - Only show when not loading and no error */}
                {!isLoading && !error && (
                    <>
                        {/* Tab Navigation */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
                            <nav className="flex relative">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 flex items-center justify-center py-4 px-6 bg-transparent focus:outline-none font-medium text-sm transition-all duration-300 border-none relative group ${activeTab === tab.id
                                                ? 'text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg transform scale-105'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <tab.icon className={`w-5 h-5 transition-all duration-300 ${activeTab === tab.id
                                                    ? 'text-white transform scale-110'
                                                    : tab.color
                                                }`} />
                                            <span className="font-semibold">{tab.name}</span>
                                        </div>

                                        {/* Animated underline for active tab */}
                                        {activeTab === tab.id && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-full"
                                                initial={{ scaleX: 0 }}
                                                animate={{ scaleX: 1 }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        )}

                                        {/* Hover effect for inactive tabs */}
                                        {activeTab !== tab.id && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-transparent group-hover:bg-gray-200 transition-all duration-300" />
                                        )}

                                        {/* Glow effect for active tab */}
                                        {activeTab === tab.id && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-lg blur-sm" />
                                        )}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="min-h-[600px]">
                            {activeTab === 'profile' && renderProfileTab()}
                            {activeTab === 'security' && renderSecurityTab()}
                            {activeTab === 'address' && renderAddressTab()}
                        </div>
                    </>
                )}
            </div>
        </SubscriberDashboardLayout>
    );
};

export default Account; 