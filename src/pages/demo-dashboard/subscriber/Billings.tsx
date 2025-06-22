import { useState, useEffect } from 'react';
import SubscriberDashboardLayout from './SubscriberDashboardLayout';
import { motion } from 'framer-motion';
import { useUser } from '../../../contexts/UserContext';
import './Billings.css';

const Billings: React.FC = () => {
    const { subscriber, updateSubscriber } = useUser();
    const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'payments' | 'settings'>('overview');
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [billingFrequency, setBillingFrequency] = useState<'monthly' | 'annually'>('monthly');
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancellationReason, setCancellationReason] = useState('');
    const [cancellationReasonType, setCancellationReasonType] = useState<string[]>([]);
    const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Payment Method Modal States
    const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
    const [showEditPaymentModal, setShowEditPaymentModal] = useState(false);
    const [showDeletePaymentModal, setShowDeletePaymentModal] = useState(false);
    const [editingPaymentMethod, setEditingPaymentMethod] = useState<any>(null);
    const [deletingPaymentMethod, setDeletingPaymentMethod] = useState<any>(null);

    // Payment Method Form Data
    const [paymentFormData, setPaymentFormData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardTypeId: ''
    });
    const [paymentFormErrors, setPaymentFormErrors] = useState<{ [key: string]: string }>({});

    // Billing Address Modal States
    const [showUpdateAddressModal, setShowUpdateAddressModal] = useState(false);
    const [addressFormData, setAddressFormData] = useState({
        primary_address: '',
        secondary_address: '',
        city: '',
        state: '',
        zip: '',
        country: ''
    });
    const [addressFormErrors, setAddressFormErrors] = useState<{ [key: string]: string }>({});
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Get the last payment to determine current billing frequency
    const lastPayment = subscriber?.payments?.[0];
    const currentBillingFrequency = lastPayment?.is_annual ? 'annually' : 'monthly';

    // Sync billing frequency with subscriber's current payment
    useEffect(() => {
        if (lastPayment?.is_annual !== undefined) {
            setBillingFrequency(currentBillingFrequency);
        }
    }, [lastPayment?.is_annual]);

    // Initialize address form data when modal opens
    useEffect(() => {
        if (showUpdateAddressModal && subscriber?.billingAddress) {
            setAddressFormData({
                primary_address: subscriber.billingAddress.primary_address || '',
                secondary_address: subscriber.billingAddress.secondary_address || '',
                city: subscriber.billingAddress.city || '',
                state: subscriber.billingAddress.state || '',
                zip: subscriber.billingAddress.zip || '',
                country: subscriber.billingAddress.country || ''
            });
            setAddressFormErrors({});
        }
    }, [showUpdateAddressModal, subscriber?.billingAddress]);

    // Billing data
    const currentPlan = subscriber?.plans?.find(plan => plan.id === subscriber?.payments?.[0]?.plan_id);
    const nextPayment = subscriber?.payments?.[0]?.next_payment_date;
    const nextPaymentDate = nextPayment ? new Date(nextPayment).toLocaleDateString() : 'N/A';
    const paymentMethod = subscriber?.paymentMethods?.find(pm => pm.id === subscriber?.payments?.[0]?.payment_method_id);
    const cardType = subscriber?.cardTypes?.find(ct => ct.id === paymentMethod?.card_type_id)?.name;
    const cardLast4 = paymentMethod?.card_number?.slice(-4);
    const paymentHistory = (subscriber?.payments || []).slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const paymentStatuses = subscriber?.paymentStatuses || [];
    const getStatus = (statusId: string) => paymentStatuses.find(s => s.id === statusId)?.name || 'Unknown';
    const availablePlans = subscriber?.plans || [];

    // Calculate annual price (assuming 20% discount for annual)
    const getPlanPrice = (plan: any) => {
        const monthlyPrice = parseFloat(plan.pricepermonth);
        if (billingFrequency === 'annually') {
            const annualPrice = monthlyPrice * 12 * 0.8; // 20% discount
            return {
                price: annualPrice,
                displayPrice: (annualPrice / 12).toFixed(2),
                totalPrice: annualPrice.toFixed(2)
            };
        }
        return {
            price: monthlyPrice,
            displayPrice: monthlyPrice.toFixed(2),
            totalPrice: monthlyPrice.toFixed(2)
        };
    };

    // Handle plan change
    const handlePlanChange = async (newPlanId: string) => {
        setIsProcessing(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            const newPlan = availablePlans.find(p => p.id === newPlanId);
            if (!newPlan) return;

            const priceInfo = getPlanPrice(newPlan);
            const newPayment = {
                id: `pay_${Date.now()}`,
                payment_method_id: subscriber?.payments?.[0]?.payment_method_id || '',
                plan_id: newPlanId,
                final_price: priceInfo.totalPrice,
                next_payment_date: new Date(Date.now() + (billingFrequency === 'annually' ? 365 : 30) * 24 * 60 * 60 * 1000),
                payment_status_id: 'status_001',
                promo_code_id: '',
                subscriber_id: subscriber?.id || '',
                billing_address_id: subscriber?.payments?.[0]?.billing_address_id || '',
                is_annual: billingFrequency === 'annually',
                createdAt: new Date()
            };

            updateSubscriber({
                payments: [newPayment, ...(subscriber?.payments || [])]
            });

            setSelectedPlan(null);
        } catch (error) {
            console.error('Error changing plan:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    // Handle checkbox changes for cancellation reasons
    const handleReasonCheckboxChange = (reason: string, checked: boolean) => {
        if (checked) {
            setCancellationReasonType(prev => [...prev, reason]);
        } else {
            setCancellationReasonType(prev => prev.filter(r => r !== reason));
        }
    };

    // Handle cancellation
    const handleCancellation = async () => {
        setHasAttemptedSubmit(true);

        // Validate cancellation reason
        if (cancellationReasonType.length === 0 || (cancellationReasonType.includes('other') && !cancellationReason.trim())) {
            return; // Don't proceed if no reason is selected or if "other" is selected but no text provided
        }

        setIsProcessing(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            updateSubscriber({
                is_active: false,
                is_auto_renew: false
            });
            setShowCancelModal(false);
            setCancellationReason('');
            setCancellationReasonType([]);
            setHasAttemptedSubmit(false);
        } catch (error) {
            console.error('Error cancelling subscription:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    // Payment Method Handlers
    const handleAddPaymentMethod = () => {
        setPaymentFormData({
            cardNumber: '',
            expiryDate: '',
            cvv: '',
            cardTypeId: ''
        });
        setPaymentFormErrors({});
        setShowAddPaymentModal(true);
    };

    const handleSetDefaultPaymentMethod = async (id: string) => {
        setIsProcessing(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const updatedPaymentMethods = subscriber?.paymentMethods?.map(pm => ({
                ...pm,
                is_default: pm.id === id
            })) || [];

            updateSubscriber({
                paymentMethods: updatedPaymentMethods
            });
        } catch (error) {
            console.error('Error setting default payment method:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleEditPaymentMethod = (paymentMethod: any) => {
        setEditingPaymentMethod(paymentMethod);
        // Format expiry date as MM/YY
        const expiryMonth = paymentMethod.expiry_month.toString().padStart(2, '0');
        const expiryYear = paymentMethod.expiry_year.toString().slice(-2); // Get last 2 digits

        // Format card number with spaces (XXXX XXXX XXXX XXXX)
        const formattedCardNumber = paymentMethod.card_number.replace(/(\d{4})/g, '$1 ').trim();

        setPaymentFormData({
            cardNumber: formattedCardNumber,
            expiryDate: `${expiryMonth}/${expiryYear}`,
            cvv: paymentMethod.cvv,
            cardTypeId: paymentMethod.card_type_id
        });
        setPaymentFormErrors({});
        setShowEditPaymentModal(true);
    };

    const handleDeletePaymentMethod = (paymentMethod: any) => {
        setDeletingPaymentMethod(paymentMethod);
        setShowDeletePaymentModal(true);
    };

    const confirmDeletePaymentMethod = async () => {
        if (!deletingPaymentMethod) return;

        setIsProcessing(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const updatedPaymentMethods = subscriber?.paymentMethods?.filter(pm => pm.id !== deletingPaymentMethod.id) || [];

            // If we're deleting the default payment method and there are other methods, set the first one as default
            if (deletingPaymentMethod.is_default && updatedPaymentMethods.length > 0) {
                updatedPaymentMethods[0].is_default = true;
            }

            updateSubscriber({
                paymentMethods: updatedPaymentMethods
            });

            setShowDeletePaymentModal(false);
            setDeletingPaymentMethod(null);
        } catch (error) {
            console.error('Error deleting payment method:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    // Payment Form Handlers
    const handlePaymentFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'cardNumber') {
            // Remove all non-digit characters
            const digitsOnly = value.replace(/\D/g, '');
            // Format as XXXX XXXX XXXX XXXX
            formattedValue = digitsOnly.replace(/(\d{4})/g, '$1 ').trim();
            // Limit to 16 digits
            if (digitsOnly.length > 16) {
                formattedValue = formattedValue.slice(0, 19); // 16 digits + 3 spaces
            }
        } else if (name === 'expiryDate') {
            // Remove all non-digit characters
            const digitsOnly = value.replace(/\D/g, '');
            // Format as MM/YY
            if (digitsOnly.length <= 2) {
                formattedValue = digitsOnly;
            } else if (digitsOnly.length <= 4) {
                formattedValue = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`;
            } else {
                formattedValue = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}`;
            }
            // Limit to 4 digits
            if (digitsOnly.length > 4) {
                formattedValue = formattedValue.slice(0, 5); // MM/YY format
            }
        } else if (name === 'cvv') {
            // Only allow digits, max 4
            formattedValue = value.replace(/\D/g, '').slice(0, 4);
        }

        setPaymentFormData(prev => ({
            ...prev,
            [name]: formattedValue
        }));

        // Clear error when user starts typing
        if (paymentFormErrors[name]) {
            setPaymentFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validatePaymentForm = () => {
        const errors: { [key: string]: string } = {};

        if (!paymentFormData.cardNumber.replace(/\s/g, '')) {
            errors.cardNumber = 'Card number is required';
        } else {
            const cleanCardNumber = paymentFormData.cardNumber.replace(/\s/g, '');

            // Check length first
            if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
                errors.cardNumber = 'Card number must be between 13 and 19 digits';
            }
            // Check if it contains only digits
            else if (!/^\d+$/.test(cleanCardNumber)) {
                errors.cardNumber = 'Card number must contain only digits';
            }
            // Check if it's a valid card number using Luhn algorithm
            else if (!validateCardNumber(cleanCardNumber)) {
                errors.cardNumber = 'Invalid card number. Please check and try again.';
            }
            // Check if card type can be detected
            else if (!getCardTypeFromNumber(cleanCardNumber)) {
                errors.cardNumber = 'Unsupported card type. Please use Visa, Mastercard, or American Express.';
            }
        }

        if (!paymentFormData.expiryDate) {
            errors.expiryDate = 'Expiry date is required';
        } else {
            const expiryParts = paymentFormData.expiryDate.split('/');
            if (expiryParts.length !== 2) {
                errors.expiryDate = 'Invalid expiry date format';
            } else {
                const month = parseInt(expiryParts[0]);
                const year = parseInt(expiryParts[1]);

                if (isNaN(month) || month < 1 || month > 12) {
                    errors.expiryDate = 'Invalid month';
                } else if (isNaN(year) || year < 0 || year > 99) {
                    errors.expiryDate = 'Invalid year';
                } else {
                    // Check if card has expired
                    const currentDate = new Date();
                    const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
                    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11

                    if (year < currentYear || (year === currentYear && month < currentMonth)) {
                        errors.expiryDate = 'Card has expired';
                    }
                }
            }
        }

        if (!paymentFormData.cvv) {
            errors.cvv = 'CVV is required';
        } else if (paymentFormData.cvv.length < 3) {
            errors.cvv = 'CVV must be at least 3 digits';
        }

        setPaymentFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSavePaymentMethod = async () => {
        if (!validatePaymentForm()) return;

        // Auto-detect card type if not already set
        const detectedCardType = getCardTypeFromNumber(paymentFormData.cardNumber);
        if (!detectedCardType) {
            setPaymentFormErrors(prev => ({
                ...prev,
                cardNumber: 'Unable to detect card type. Please check your card number.'
            }));
            return;
        }

        // Parse expiry date
        const expiryParts = paymentFormData.expiryDate.split('/');
        const expiryMonth = parseInt(expiryParts[0]);
        const expiryYear = parseInt(expiryParts[1]);
        const fullYear = 2000 + expiryYear; // Convert YY to YYYY

        setIsProcessing(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const newPaymentMethod = {
                id: editingPaymentMethod ? editingPaymentMethod.id : `pm_${Date.now()}`,
                card_number: paymentFormData.cardNumber.replace(/\s/g, ''),
                expiry_month: expiryMonth,
                expiry_year: fullYear,
                cvv: paymentFormData.cvv,
                subscriber_id: subscriber?.id || '',
                card_type_id: detectedCardType,
                is_default: editingPaymentMethod ? editingPaymentMethod.is_default : (subscriber?.paymentMethods?.length === 0),
                updated_at: new Date(),
                createdAt: editingPaymentMethod ? editingPaymentMethod.createdAt : new Date()
            };

            let updatedPaymentMethods;
            if (editingPaymentMethod) {
                // Update existing payment method
                updatedPaymentMethods = subscriber?.paymentMethods?.map(pm =>
                    pm.id === editingPaymentMethod.id ? newPaymentMethod : pm
                ) || [];
            } else {
                // Add new payment method
                updatedPaymentMethods = [...(subscriber?.paymentMethods || []), newPaymentMethod];
            }

            updateSubscriber({
                paymentMethods: updatedPaymentMethods
            });

            setShowAddPaymentModal(false);
            setShowEditPaymentModal(false);
            setEditingPaymentMethod(null);
            setPaymentFormData({
                cardNumber: '',
                expiryDate: '',
                cvv: '',
                cardTypeId: ''
            });
        } catch (error) {
            console.error('Error saving payment method:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const getCardTypeFromNumber = (cardNumber: string) => {
        const cleanNumber = cardNumber.replace(/\s/g, '');
        if (cleanNumber.startsWith('4')) return 'card_type_001'; // Visa
        if (cleanNumber.startsWith('5')) return 'card_type_002'; // Mastercard
        if (cleanNumber.startsWith('3')) return 'card_type_003'; // American Express
        return '';
    };

    // Get card type name for display
    const getCardTypeName = (cardNumber: string) => {
        const cleanNumber = cardNumber.replace(/\s/g, '');
        if (cleanNumber.startsWith('4')) return 'Visa';
        if (cleanNumber.startsWith('5')) return 'Mastercard';
        if (cleanNumber.startsWith('3')) return 'American Express';
        return '';
    };

    // Get card type name from card type ID
    const getCardTypeNameFromId = (cardTypeId: string) => {
        if (cardTypeId === 'card_type_001') return 'Visa';
        if (cardTypeId === 'card_type_002') return 'Mastercard';
        if (cardTypeId === 'card_type_003') return 'American Express';
        return '';
    };

    // Validate card number using Luhn algorithm
    const validateCardNumber = (cardNumber: string): boolean => {
        const cleanNumber = cardNumber.replace(/\s/g, '');

        // Check if it's a valid length (13-19 digits)
        if (cleanNumber.length < 13 || cleanNumber.length > 19) {
            return false;
        }

        // Check if it contains only digits
        if (!/^\d+$/.test(cleanNumber)) {
            return false;
        }

        // Luhn algorithm implementation
        let sum = 0;
        let isEven = false;

        // Loop through values starting from the rightmost side
        for (let i = cleanNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cleanNumber.charAt(i));

            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }

            sum += digit;
            isEven = !isEven;
        }

        return sum % 10 === 0;
    };

    // Billing Address Handlers
    const handleUpdateAddress = () => {
        setShowUpdateAddressModal(true);
    };

    const handleAddressFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // Auto-format ZIP code (allow only digits and hyphens)
        if (name === 'zip') {
            formattedValue = value.replace(/[^0-9-]/g, '');
            // Limit length to 10 characters (for formats like 12345-6789)
            if (formattedValue.length > 10) {
                formattedValue = formattedValue.slice(0, 10);
            }
        }

        // Auto-format state (capitalize first letter of each word)
        if (name === 'state') {
            formattedValue = value.replace(/\b\w/g, l => l.toUpperCase());
        }

        // Auto-format city (capitalize first letter of each word)
        if (name === 'city') {
            formattedValue = value.replace(/\b\w/g, l => l.toUpperCase());
        }

        setAddressFormData(prev => ({
            ...prev,
            [name]: formattedValue
        }));

        // Clear error when user starts typing
        if (addressFormErrors[name]) {
            setAddressFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateAddressForm = () => {
        const errors: { [key: string]: string } = {};

        if (!addressFormData.primary_address.trim()) {
            errors.primary_address = 'Primary address is required';
        } else if (addressFormData.primary_address.trim().length < 5) {
            errors.primary_address = 'Primary address must be at least 5 characters';
        }

        if (!addressFormData.city.trim()) {
            errors.city = 'City is required';
        } else if (addressFormData.city.trim().length < 2) {
            errors.city = 'City must be at least 2 characters';
        }

        if (!addressFormData.state.trim()) {
            errors.state = 'State/Province is required';
        } else if (addressFormData.state.trim().length < 2) {
            errors.state = 'State/Province must be at least 2 characters';
        }

        if (!addressFormData.zip.trim()) {
            errors.zip = 'ZIP/Postal code is required';
        } else {
            const zipPattern = /^\d{5}(-\d{4})?$/;
            if (!zipPattern.test(addressFormData.zip.trim())) {
                errors.zip = 'Please enter a valid ZIP/Postal code (e.g., 12345 or 12345-6789)';
            }
        }

        if (!addressFormData.country.trim()) {
            errors.country = 'Country is required';
        }

        setAddressFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSaveAddress = async () => {
        if (!validateAddressForm()) return;

        setIsProcessing(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const updatedBillingAddress = {
                id: subscriber?.billingAddress?.id || `addr_${Date.now()}`,
                subscriber_id: subscriber?.id || '',
                primary_address: addressFormData.primary_address.trim(),
                secondary_address: addressFormData.secondary_address.trim(),
                city: addressFormData.city.trim(),
                state: addressFormData.state.trim(),
                zip: addressFormData.zip.trim(),
                country: addressFormData.country.trim(),
                createdAt: subscriber?.billingAddress?.createdAt || new Date(),
                updatedAt: new Date()
            };

            updateSubscriber({
                billingAddress: updatedBillingAddress
            });

            setShowUpdateAddressModal(false);
            setAddressFormData({
                primary_address: '',
                secondary_address: '',
                city: '',
                state: '',
                zip: '',
                country: ''
            });
            setAddressFormErrors({});

            // Show success notification
            setSuccessMessage(subscriber?.billingAddress ? 'Billing address updated successfully!' : 'Billing address added successfully!');
            setShowSuccessNotification(true);

            // Hide notification after 3 seconds
            setTimeout(() => {
                setShowSuccessNotification(false);
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            console.error('Error updating billing address:', error);
            // You could add a toast notification here for better UX
        } finally {
            setIsProcessing(false);
        }
    };

    // Auto-detect card type when card number changes
    useEffect(() => {
        if (paymentFormData.cardNumber) {
            const detectedCardType = getCardTypeFromNumber(paymentFormData.cardNumber);
            if (detectedCardType) {
                setPaymentFormData(prev => ({
                    ...prev,
                    cardTypeId: detectedCardType
                }));
            }
        }
    }, [paymentFormData.cardNumber]);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'plans', label: 'Plans', icon: '💎' },
        { id: 'payments', label: 'Payments', icon: '💳' },
        { id: 'settings', label: 'Settings', icon: '⚙️' }
    ];

    return (
        <SubscriberDashboardLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Billing & Subscription</h1>
                    <p className="text-gray-600 mt-2">Manage your subscription, payments, and billing information</p>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                    <div className="flex space-x-1 p-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all focus:outline-none border-none ${activeTab === tab.id
                                    ? 'bg-purple-100 text-purple-700 border-2 border-purple-200'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <span>{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="min-h-[600px]">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Current Plan Card */}
                            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-white">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-1">{currentPlan?.name || 'N/A'}</h2>
                                        <p className="text-purple-100">{currentPlan?.description}</p>
                                        {lastPayment && (
                                            <div className="mt-2">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${lastPayment.is_annual
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {lastPayment.is_annual ? 'Annual Billing' : 'Monthly Billing'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold">
                                            ${currentPlan?.pricepermonth || '0'}
                                            <span className="text-lg">/{lastPayment?.is_annual ? 'mo' : 'mo'}</span>
                                        </div>
                                        {lastPayment?.is_annual && (
                                            <div className="text-sm text-purple-100">
                                                ${(parseFloat(currentPlan?.pricepermonth || '0') * 12 * 0.8).toFixed(2)} billed annually
                                            </div>
                                        )}
                                        <div className="text-purple-100">Next: {nextPaymentDate}</div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setActiveTab('plans')}
                                        className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition focus:outline-none border-none"
                                    >
                                        Change Plan
                                    </button>
                                    <button
                                        onClick={() => setShowCancelModal(true)}
                                        className="px-4 py-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition focus:outline-none border-none"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>

                            {/* Quick Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="bg-white rounded-xl p-4 shadow-sm border">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <span className="text-green-600 text-lg">💰</span>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900">
                                                ${paymentHistory.reduce((sum, p) => sum + parseFloat(p.final_price), 0).toLocaleString()}
                                            </div>
                                            <div className="text-sm text-gray-600">Total Paid</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-4 shadow-sm border">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <span className="text-blue-600 text-lg">📅</span>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900">{paymentHistory.length}</div>
                                            <div className="text-sm text-gray-600">Total Payments</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-4 shadow-sm border">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <span className="text-purple-600 text-lg">💳</span>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900">{cardType}</div>
                                            <div className="text-sm text-gray-600">•••• {cardLast4}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-4 shadow-sm border">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                            <span className="text-orange-600 text-lg">👥</span>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900">
                                                {(subscriber?.admins?.length || 0) + (subscriber?.teachers?.length || 0) + (subscriber?.students?.length || 0) + (subscriber?.parents?.length || 0)}
                                            </div>
                                            <div className="text-sm text-gray-600">Total Users</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Billing Frequency Info */}
                            {lastPayment && (
                                <div className="bg-white rounded-xl p-4 shadow-sm border">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                                <span className="text-indigo-600 text-lg">🔄</span>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">
                                                    {lastPayment.is_annual ? 'Annual Billing' : 'Monthly Billing'}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {lastPayment.is_annual
                                                        ? 'Billed yearly with 20% discount'
                                                        : 'Billed monthly'
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setActiveTab('plans')}
                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition focus:outline-none border-none text-sm font-medium"
                                        >
                                            Change Billing
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Usage vs Limits */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border">
                                <h3 className="text-lg font-semibold mb-4">Usage vs Plan Limits</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { label: 'Admins', current: subscriber?.admins?.length || 0, limit: currentPlan?.max_admin, color: 'purple' },
                                        { label: 'Teachers', current: subscriber?.teachers?.length || 0, limit: currentPlan?.max_teacher, color: 'blue' },
                                        { label: 'Students', current: subscriber?.students?.length || 0, limit: currentPlan?.max_student, color: 'green' },
                                        { label: 'Parents', current: subscriber?.parents?.length || 0, limit: currentPlan?.max_parent, color: 'orange' }
                                    ].map((item) => (
                                        <div key={item.label} className="text-center">
                                            <div className="text-sm text-gray-600 mb-1">{item.label}</div>
                                            <div className="text-xl font-bold text-gray-900 mb-2">
                                                {item.current} / {item.limit || '∞'}
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full progress-bar progress-bar-${item.color}`}
                                                    data-width={`${item.limit ? Math.max(1, Math.min(100, Math.round((item.current / item.limit) * 100))) : 0}`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Payments */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">Recent Payments</h3>
                                    <button onClick={() => setActiveTab('payments')} className="text-purple-600 hover:text-purple-700 hover:bg-purple-100 rounded-lg text-sm font-medium focus:outline-none border-none">
                                        View All →
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {paymentHistory.slice(0, 3).map((payment) => {
                                        const plan = subscriber?.plans?.find(p => p.id === payment.plan_id);
                                        return (
                                            <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <div className="font-medium text-gray-900">{plan?.name || 'N/A'}</div>
                                                    <div className="text-sm text-gray-600">{new Date(payment.createdAt).toLocaleDateString()}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-semibold text-gray-900">${payment.final_price}</div>
                                                    <div className={`text-xs px-2 py-1 rounded-full ${getStatus(payment.payment_status_id) === 'Completed'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {getStatus(payment.payment_status_id)}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Plans Tab */}
                    {activeTab === 'plans' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="bg-white rounded-xl p-6 shadow-sm border">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold">Available Plans</h3>

                                    {/* Billing Frequency Toggle */}
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-gray-600">Billing Frequency:</span>
                                        <div className="flex bg-gray-100 rounded-lg p-1">
                                            <button
                                                onClick={() => setBillingFrequency('monthly')}
                                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all focus:outline-none border-none ${billingFrequency === 'monthly'
                                                    ? 'bg-white text-purple-600 shadow-sm'
                                                    : 'text-gray-600 hover:text-gray-900'
                                                    }`}
                                            >
                                                Monthly
                                            </button>
                                            <button
                                                onClick={() => setBillingFrequency('annually')}
                                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all focus:outline-none border-none ${billingFrequency === 'annually'
                                                    ? 'bg-white text-purple-600 shadow-sm'
                                                    : 'text-gray-600 hover:text-gray-900'
                                                    }`}
                                            >
                                                Annually
                                                <span className="ml-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                                    Save 20%
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {availablePlans.map((plan) => {
                                        const isCurrentPlan = plan.id === currentPlan?.id;
                                        const priceInfo = getPlanPrice(plan);

                                        return (
                                            <div
                                                key={plan.id}
                                                className={`relative p-4 rounded-lg border-2 ${isCurrentPlan
                                                    ? 'border-purple-500 bg-purple-50'
                                                    : 'border-gray-200 bg-white hover:border-purple-300 cursor-pointer'
                                                    }`}
                                                onClick={() => !isCurrentPlan && setSelectedPlan(plan.id)}
                                            >
                                                {isCurrentPlan && (
                                                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                                        <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                                                            Current
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="text-center mb-4">
                                                    <h4 className="text-lg font-bold text-gray-900 mb-1">{plan.name}</h4>
                                                    <div className="text-2xl font-bold text-purple-600 mb-1">
                                                        ${priceInfo.displayPrice}
                                                        <span className="text-sm font-normal text-gray-500">
                                                            /{billingFrequency === 'annually' ? 'month' : 'month'}
                                                        </span>
                                                    </div>
                                                    {billingFrequency === 'annually' && (
                                                        <div className="text-sm text-gray-500 mb-1">
                                                            ${priceInfo.totalPrice} billed annually
                                                        </div>
                                                    )}
                                                    <div className="text-sm text-gray-600">{plan.description}</div>
                                                </div>

                                                <div className="space-y-2 mb-4">
                                                    <div className="flex justify-between text-sm">
                                                        <span>Admins:</span>
                                                        <span className="font-semibold">{plan.max_admin || '∞'}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span>Teachers:</span>
                                                        <span className="font-semibold">{plan.max_teacher || '∞'}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span>Students:</span>
                                                        <span className="font-semibold">{plan.max_student || '∞'}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span>Parents:</span>
                                                        <span className="font-semibold">{plan.max_parent || '∞'}</span>
                                                    </div>
                                                </div>

                                                {!isCurrentPlan && (
                                                    <button
                                                        className={`w-full py-2 rounded-lg font-semibold transition focus:outline-none border-none ${selectedPlan === plan.id
                                                            ? 'bg-purple-600 text-white'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            }`}
                                                        onClick={() => setSelectedPlan(plan.id)}
                                                    >
                                                        {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {selectedPlan && !isProcessing && (
                                    <div className="mt-6 flex justify-end">
                                        <button
                                            onClick={() => handlePlanChange(selectedPlan)}
                                            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition focus:outline-none border-none"
                                        >
                                            Change Plan
                                        </button>
                                    </div>
                                )}

                                {isProcessing && (
                                    <div className="mt-6 flex justify-center">
                                        <div className="flex items-center gap-2 text-purple-600">
                                            <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                                            Processing...
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Payments Tab */}
                    {activeTab === 'payments' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="bg-white rounded-xl p-6 shadow-sm border">
                                <h3 className="text-lg font-semibold mb-4">Payment History</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {paymentHistory.map((payment) => {
                                                const plan = subscriber?.plans?.find(p => p.id === payment.plan_id);
                                                const isAnnual = payment.is_annual;
                                                return (
                                                    <tr key={payment.id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-sm text-gray-900">{new Date(payment.createdAt).toLocaleDateString()}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-900">{plan?.name || 'N/A'}</td>
                                                        <td className="px-4 py-3">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${isAnnual
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : 'bg-green-100 text-green-800'
                                                                }`}>
                                                                {isAnnual ? 'Annual' : 'Monthly'}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">${payment.final_price}</td>
                                                        <td className="px-4 py-3">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatus(payment.payment_status_id) === 'Completed'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                                }`}>
                                                                {getStatus(payment.payment_status_id)}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <button className="text-purple-600 hover:text-purple-700 text-sm font-medium focus:outline-none border-none hover:bg-purple-100 rounded-lg">
                                                                Download
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Payment Method */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border">
                                <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
                                {subscriber?.paymentMethods && subscriber.paymentMethods.length > 0 ? (
                                    <div className="space-y-4">
                                        {subscriber.paymentMethods.map((pm) => {
                                            const type = subscriber.cardTypes?.find(ct => ct.id === pm.card_type_id)?.name;
                                            const isDefault = pm.is_default;
                                            return (
                                                <div key={pm.id} className={`flex items-center justify-between p-4 rounded-lg border ${isDefault
                                                    ? 'bg-green-50 border-green-200'
                                                    : 'bg-gray-50 border-gray-200'}`}>
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                                                            <span className="text-white font-bold text-sm">
                                                                {type === 'Visa' ? 'VISA' : type === 'Mastercard' ? 'MC' : 'CARD'}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-gray-900">{type} •••• {pm.card_number.slice(-4)}</div>
                                                            <div className="text-sm text-gray-600">Expires {pm.expiry_month}/{pm.expiry_year}</div>
                                                            {isDefault && (
                                                                <span className="inline-flex items-center px-2 py-1 mt-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full border border-green-200">
                                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                                                                    Default
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {!isDefault && (
                                                            <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium hover:bg-purple-200 focus:outline-none border-none" onClick={() => handleSetDefaultPaymentMethod(pm.id)}>
                                                                Set as Default
                                                            </button>
                                                        )}
                                                        <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 focus:outline-none border-none" onClick={() => handleEditPaymentMethod(pm)}>
                                                            Edit
                                                        </button>
                                                        <button className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 focus:outline-none border-none" onClick={() => handleDeletePaymentMethod(pm)}>
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-300 hover:text-purple-600 transition focus:outline-none border-none" onClick={handleAddPaymentMethod}>
                                            + Add Payment Method
                                        </button>
                                    </div>
                                ) : (
                                    <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-300 hover:text-purple-600 transition focus:outline-none border-none" onClick={handleAddPaymentMethod}>
                                        + Add Payment Method
                                    </button>
                                )}
                            </div>

                            {/* Billing Address */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border">
                                <h3 className="text-lg font-semibold mb-4">Billing Address</h3>
                                {subscriber?.billingAddress ? (
                                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                    <span className="text-green-600 text-sm">📍</span>
                                                </div>
                                                <span className="text-sm font-medium text-green-800">Billing Address Set</span>
                                            </div>
                                            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                                                Active
                                            </span>
                                        </div>
                                        <div className="space-y-1 text-gray-700">
                                            <div className="font-medium">{subscriber.billingAddress.primary_address}</div>
                                            {subscriber.billingAddress.secondary_address && (
                                                <div className="text-gray-600">{subscriber.billingAddress.secondary_address}</div>
                                            )}
                                            <div>
                                                {subscriber.billingAddress.city}, {subscriber.billingAddress.state} {subscriber.billingAddress.zip}
                                            </div>
                                            <div className="font-medium">{subscriber.billingAddress.country}</div>
                                        </div>
                                        <div className="mt-4 flex gap-2">
                                            <button
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition focus:outline-none border-none text-sm font-medium"
                                                onClick={handleUpdateAddress}
                                            >
                                                Update Address
                                            </button>
                                            <button
                                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition focus:outline-none border-none text-sm font-medium"
                                                onClick={() => {
                                                    // Copy address to clipboard
                                                    if (subscriber?.billingAddress) {
                                                        const addressText = `${subscriber.billingAddress.primary_address}${subscriber.billingAddress.secondary_address ? ', ' + subscriber.billingAddress.secondary_address : ''}, ${subscriber.billingAddress.city}, ${subscriber.billingAddress.state} ${subscriber.billingAddress.zip}, ${subscriber.billingAddress.country}`;
                                                        navigator.clipboard.writeText(addressText);
                                                        // You could add a toast notification here
                                                    }
                                                }}
                                            >
                                                Copy Address
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <span className="text-gray-400 text-xl">📍</span>
                                        </div>
                                        <h4 className="text-gray-900 font-medium mb-1">No Billing Address</h4>
                                        <p className="text-gray-600 text-sm mb-4">Add a billing address to receive invoices and manage your subscription</p>
                                        <button
                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition focus:outline-none border-none text-sm font-medium"
                                            onClick={handleUpdateAddress}
                                        >
                                            + Add Billing Address
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Preferences */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border">
                                <h3 className="text-lg font-semibold mb-4">Preferences</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="auto-renew" className="flex-1">
                                            <div className="font-medium text-gray-900">Auto-renew subscription</div>
                                            <div className="text-sm text-gray-600">Automatically renew your subscription</div>
                                        </label>
                                        <input
                                            type="checkbox"
                                            id="auto-renew"
                                            checked={subscriber?.is_auto_renew || false}
                                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="email-receipts" className="flex-1">
                                            <div className="font-medium text-gray-900">Email receipts</div>
                                            <div className="text-sm text-gray-600">Receive payment receipts via email</div>
                                        </label>
                                        <input
                                            type="checkbox"
                                            id="email-receipts"
                                            defaultChecked
                                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900">Billing Frequency</div>
                                            <div className="text-sm text-gray-600">
                                                {lastPayment?.is_annual ? 'Annual billing with 20% discount' : 'Monthly billing'}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setActiveTab('plans')}
                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition focus:outline-none border-none text-sm font-medium"
                                        >
                                            Change
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Cancellation Modal */}
                {showCancelModal && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowCancelModal(false)}
                    >
                        <motion.div
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 40, opacity: 0 }}
                            className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl text-gray-900 relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl text-red-600">⚠️</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Subscription</h3>
                                <p className="text-gray-600">
                                    Are you sure you want to cancel your subscription? This action cannot be undone.
                                </p>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Reason for cancellation <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {[
                                        { value: 'too_expensive', label: 'Too expensive' },
                                        { value: 'not_using', label: 'Not using the service enough' },
                                        { value: 'switching', label: 'Switching to another service' },
                                        { value: 'features', label: 'Missing features I need' },
                                        { value: 'support', label: 'Poor customer support' },
                                        { value: 'technical', label: 'Technical issues' },
                                        { value: 'temporary', label: 'Temporary cancellation' },
                                        { value: 'other', label: 'Other' }
                                    ].map((reason) => (
                                        <div key={reason.value} className="flex items-start">
                                            <input
                                                type="checkbox"
                                                id={`reason-${reason.value}`}
                                                checked={cancellationReasonType.includes(reason.value)}
                                                onChange={(e) => handleReasonCheckboxChange(reason.value, e.target.checked)}
                                                className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                            />
                                            <label htmlFor={`reason-${reason.value}`} className="ml-3 text-sm text-gray-700">
                                                {reason.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                {hasAttemptedSubmit && cancellationReasonType.length === 0 && (
                                    <p className="text-xs text-red-600 mt-3">Please select at least one reason for cancellation</p>
                                )}

                                {cancellationReasonType.includes('other') && (
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Please specify <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={cancellationReason}
                                            onChange={(e) => setCancellationReason(e.target.value)}
                                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none focus:outline-none ${hasAttemptedSubmit && cancellationReasonType.includes('other') && !cancellationReason.trim() ? 'border-red-500' : 'border-gray-300'}`}
                                            rows={3}
                                            placeholder="Please let us know why you're cancelling..."
                                        />
                                        {hasAttemptedSubmit && cancellationReasonType.includes('other') && !cancellationReason.trim() && (
                                            <p className="text-xs text-red-600 mt-1">Please provide a reason for cancellation</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                <h4 className="font-semibold text-red-800 mb-2">What happens when you cancel:</h4>
                                <ul className="text-sm text-red-700 space-y-1">
                                    <li>• Your subscription will end on {nextPaymentDate}</li>
                                    <li>• You'll lose access to premium features</li>
                                    <li>• Your data will be retained for 30 days</li>
                                    <li>• You can reactivate anytime</li>
                                </ul>
                            </div>

                            <div className="flex justify-end gap-4">
                                <button
                                    className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition focus:outline-none border-none"
                                    onClick={() => {
                                        setShowCancelModal(false);
                                        setHasAttemptedSubmit(false);
                                    }}
                                >
                                    Keep Subscription
                                </button>
                                <button
                                    className={`px-6 py-3 rounded-xl font-semibold transition focus:outline-none border-none ${!isProcessing && (cancellationReasonType.length > 0 && (!cancellationReasonType.includes('other') || cancellationReason.trim()))
                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                    onClick={handleCancellation}
                                    disabled={isProcessing || cancellationReasonType.length === 0 || (cancellationReasonType.includes('other') && !cancellationReason.trim())}
                                >
                                    {isProcessing ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Cancelling...
                                        </div>
                                    ) : (
                                        'Cancel Subscription'
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Add/Edit Payment Method Modal */}
                {(showAddPaymentModal || showEditPaymentModal) && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        onClick={() => {
                            setShowAddPaymentModal(false);
                            setShowEditPaymentModal(false);
                            setEditingPaymentMethod(null);
                        }}
                    >
                        <motion.div
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 40, opacity: 0 }}
                            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-gray-900 relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl text-purple-600">💳</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {showEditPaymentModal ? 'Edit Payment Method' : 'Add Payment Method'}
                                </h3>
                                <p className="text-gray-600">
                                    {showEditPaymentModal ? 'Update your payment method details' : 'Add a new payment method to your account'}
                                </p>
                            </div>

                            {/* Current Payment Method Details (only shown when editing) */}
                            {showEditPaymentModal && editingPaymentMethod && (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                                    <h4 className="font-semibold text-gray-900 mb-3">Current Payment Method</h4>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">
                                                {getCardTypeNameFromId(editingPaymentMethod.card_type_id) === 'Visa' ? 'VISA' :
                                                    getCardTypeNameFromId(editingPaymentMethod.card_type_id) === 'Mastercard' ? 'MC' :
                                                        getCardTypeNameFromId(editingPaymentMethod.card_type_id) === 'American Express' ? 'AMEX' : 'CARD'}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">
                                                {getCardTypeNameFromId(editingPaymentMethod.card_type_id)} •••• {editingPaymentMethod.card_number.slice(-4)}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Expires {editingPaymentMethod.expiry_month.toString().padStart(2, '0')}/{editingPaymentMethod.expiry_year.toString().slice(-2)}
                                            </div>
                                            {editingPaymentMethod.is_default && (
                                                <span className="inline-flex items-center px-2 py-1 mt-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                                                    Default
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                {/* Card Number */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Card Number <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            value={paymentFormData.cardNumber}
                                            onChange={handlePaymentFormChange}
                                            placeholder="1234 5678 9012 3456"
                                            className={`w-full p-3 pr-12 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition ${paymentFormErrors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {paymentFormData.cardNumber && getCardTypeName(paymentFormData.cardNumber) && (
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                <div className="w-8 h-5 bg-gradient-to-r from-purple-600 to-purple-700 rounded flex items-center justify-center">
                                                    <span className="text-white font-bold text-xs">
                                                        {getCardTypeName(paymentFormData.cardNumber) === 'Visa' ? 'VISA' :
                                                            getCardTypeName(paymentFormData.cardNumber) === 'Mastercard' ? 'MC' :
                                                                getCardTypeName(paymentFormData.cardNumber) === 'American Express' ? 'AMEX' : 'CARD'}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {paymentFormData.cardNumber && getCardTypeName(paymentFormData.cardNumber) && (
                                        <p className="text-xs text-green-600 mt-1">
                                            ✓ Detected: {getCardTypeName(paymentFormData.cardNumber)}
                                        </p>
                                    )}
                                    {paymentFormData.cardNumber && paymentFormData.cardNumber.replace(/\s/g, '').length >= 13 && !paymentFormErrors.cardNumber && validateCardNumber(paymentFormData.cardNumber.replace(/\s/g, '')) && (
                                        <p className="text-xs text-green-600 mt-1">
                                            ✓ Valid card number
                                        </p>
                                    )}
                                    {paymentFormData.cardNumber && paymentFormData.cardNumber.replace(/\s/g, '').length >= 13 && !validateCardNumber(paymentFormData.cardNumber.replace(/\s/g, '')) && (
                                        <p className="text-xs text-red-600 mt-1">
                                            ✗ Invalid card number
                                        </p>
                                    )}
                                    {paymentFormErrors.cardNumber && (
                                        <p className="text-xs text-red-600 mt-1">{paymentFormErrors.cardNumber}</p>
                                    )}
                                </div>

                                {/* Expiry Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Expiry Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="expiryDate"
                                        value={paymentFormData.expiryDate}
                                        onChange={handlePaymentFormChange}
                                        placeholder="MM/YY"
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition ${paymentFormErrors.expiryDate ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {paymentFormErrors.expiryDate && (
                                        <p className="text-xs text-red-600 mt-1">{paymentFormErrors.expiryDate}</p>
                                    )}
                                </div>

                                {/* CVV */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        CVV <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="cvv"
                                        value={paymentFormData.cvv}
                                        onChange={handlePaymentFormChange}
                                        placeholder="123"
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition ${paymentFormErrors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {paymentFormErrors.cvv && (
                                        <p className="text-xs text-red-600 mt-1">{paymentFormErrors.cvv}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 mt-8">
                                <button
                                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition focus:outline-none border-none"
                                    onClick={() => {
                                        setShowAddPaymentModal(false);
                                        setShowEditPaymentModal(false);
                                        setEditingPaymentMethod(null);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={`px-6 py-3 rounded-xl font-semibold transition focus:outline-none border-none ${!isProcessing
                                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                                        : 'bg-purple-300 text-purple-500 cursor-not-allowed'
                                        }`}
                                    onClick={handleSavePaymentMethod}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Saving...
                                        </div>
                                    ) : (
                                        showEditPaymentModal ? 'Update Method' : 'Add Method'
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Delete Payment Method Modal */}
                {showDeletePaymentModal && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowDeletePaymentModal(false)}
                    >
                        <motion.div
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 40, opacity: 0 }}
                            className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl text-gray-900 relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl text-red-600">🗑️</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Payment Method</h3>
                                <p className="text-gray-600">
                                    Are you sure you want to delete this payment method? This action cannot be undone.
                                </p>
                            </div>

                            {deletingPaymentMethod && (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">
                                                {getCardTypeName(deletingPaymentMethod.card_number)}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">
                                                {getCardTypeName(deletingPaymentMethod.card_number)} •••• {deletingPaymentMethod.card_number.slice(-4)}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Expires {deletingPaymentMethod.expiry_month}/{deletingPaymentMethod.expiry_year}
                                            </div>
                                            {deletingPaymentMethod.is_default && (
                                                <span className="inline-flex items-center px-2 py-1 mt-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                                                    Default
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                <h4 className="font-semibold text-red-800 mb-2">What happens when you delete:</h4>
                                <ul className="text-sm text-red-700 space-y-1">
                                    <li>• This payment method will be permanently removed</li>
                                    <li>• If this is your default method, another method will become default</li>
                                    <li>• You can add a new payment method anytime</li>
                                </ul>
                            </div>

                            <div className="flex justify-end gap-4">
                                <button
                                    className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition focus:outline-none border-none"
                                    onClick={() => setShowDeletePaymentModal(false)}
                                >
                                    Keep Method
                                </button>
                                <button
                                    className={`px-6 py-3 rounded-xl font-semibold transition focus:outline-none border-none ${!isProcessing
                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                        : 'bg-red-300 text-red-500 cursor-not-allowed'
                                        }`}
                                    onClick={confirmDeletePaymentMethod}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Deleting...
                                        </div>
                                    ) : (
                                        'Delete Method'
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Update Billing Address Modal */}
                {showUpdateAddressModal && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowUpdateAddressModal(false)}
                    >
                        <motion.div
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 40, opacity: 0 }}
                            className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl text-gray-900 relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl text-blue-600">📍</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {subscriber?.billingAddress ? 'Update Billing Address' : 'Add Billing Address'}
                                </h3>
                                <p className="text-gray-600">
                                    {subscriber?.billingAddress
                                        ? 'Update your billing address information'
                                        : 'Add a billing address for your account'
                                    }
                                </p>
                            </div>

                            {/* Current Address Display (only shown when updating) */}
                            {subscriber?.billingAddress && (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                                    <h4 className="font-semibold text-gray-900 mb-3">Current Billing Address</h4>
                                    <div className="text-gray-700">
                                        <div>{subscriber.billingAddress.primary_address}</div>
                                        {subscriber.billingAddress.secondary_address && (
                                            <div>{subscriber.billingAddress.secondary_address}</div>
                                        )}
                                        <div>
                                            {subscriber.billingAddress.city}, {subscriber.billingAddress.state} {subscriber.billingAddress.zip}
                                        </div>
                                        <div>{subscriber.billingAddress.country}</div>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Primary Address */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address 1 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="primary_address"
                                        value={addressFormData.primary_address}
                                        onChange={handleAddressFormChange}
                                        placeholder="123 Main Street"
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${addressFormErrors.primary_address ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {addressFormErrors.primary_address && (
                                        <p className="text-xs text-red-600 mt-1">{addressFormErrors.primary_address}</p>
                                    )}
                                </div>

                                {/* Secondary Address */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address 2 (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        name="secondary_address"
                                        value={addressFormData.secondary_address}
                                        onChange={handleAddressFormChange}
                                        placeholder="Apt, Suite, Unit, etc."
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    />
                                </div>

                                {/* City */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        City <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={addressFormData.city}
                                        onChange={handleAddressFormChange}
                                        placeholder="City"
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${addressFormErrors.city ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {addressFormErrors.city && (
                                        <p className="text-xs text-red-600 mt-1">{addressFormErrors.city}</p>
                                    )}
                                </div>

                                {/* State/Province */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        State/Province <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={addressFormData.state}
                                        onChange={handleAddressFormChange}
                                        placeholder="State or Province"
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${addressFormErrors.state ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {addressFormErrors.state && (
                                        <p className="text-xs text-red-600 mt-1">{addressFormErrors.state}</p>
                                    )}
                                </div>

                                {/* ZIP/Postal Code */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        ZIP/Postal Code <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="zip"
                                        value={addressFormData.zip}
                                        onChange={handleAddressFormChange}
                                        placeholder="ZIP or Postal Code"
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${addressFormErrors.zip ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {addressFormErrors.zip && (
                                        <p className="text-xs text-red-600 mt-1">{addressFormErrors.zip}</p>
                                    )}
                                </div>

                                {/* Country */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Country <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="country"
                                        value={addressFormData.country}
                                        onChange={handleAddressFormChange}
                                        aria-label="Select country"
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${addressFormErrors.country ? 'border-red-500' : 'border-gray-300'}`}
                                    >
                                        <option value="">Select Country</option>
                                        <option value="United States">United States</option>
                                        <option value="Canada">Canada</option>
                                        <option value="United Kingdom">United Kingdom</option>
                                        <option value="Australia">Australia</option>
                                        <option value="Germany">Germany</option>
                                        <option value="France">France</option>
                                        <option value="Japan">Japan</option>
                                        <option value="South Korea">South Korea</option>
                                        <option value="Singapore">Singapore</option>
                                        <option value="Lebanon">Lebanon</option>
                                        <option value="Saudi Arabia">Saudi Arabia</option>
                                        <option value="UAE">United Arab Emirates</option>
                                        <option value="Qatar">Qatar</option>
                                        <option value="Kuwait">Kuwait</option>
                                        <option value="Bahrain">Bahrain</option>
                                        <option value="Oman">Oman</option>
                                        <option value="Jordan">Jordan</option>
                                        <option value="Egypt">Egypt</option>
                                        <option value="Morocco">Morocco</option>
                                        <option value="Tunisia">Tunisia</option>
                                        <option value="Algeria">Algeria</option>
                                        <option value="Libya">Libya</option>
                                        <option value="Sudan">Sudan</option>
                                        <option value="Ethiopia">Ethiopia</option>
                                        <option value="Kenya">Kenya</option>
                                        <option value="Nigeria">Nigeria</option>
                                        <option value="Ghana">Ghana</option>
                                        <option value="South Africa">South Africa</option>
                                        <option value="India">India</option>
                                        <option value="Pakistan">Pakistan</option>
                                        <option value="Bangladesh">Bangladesh</option>
                                        <option value="Sri Lanka">Sri Lanka</option>
                                        <option value="Nepal">Nepal</option>
                                        <option value="Bhutan">Bhutan</option>
                                        <option value="Maldives">Maldives</option>
                                        <option value="China">China</option>
                                        <option value="Hong Kong">Hong Kong</option>
                                        <option value="Taiwan">Taiwan</option>
                                        <option value="Thailand">Thailand</option>
                                        <option value="Vietnam">Vietnam</option>
                                        <option value="Malaysia">Malaysia</option>
                                        <option value="Indonesia">Indonesia</option>
                                        <option value="Philippines">Philippines</option>
                                        <option value="Brazil">Brazil</option>
                                        <option value="Argentina">Argentina</option>
                                        <option value="Chile">Chile</option>
                                        <option value="Colombia">Colombia</option>
                                        <option value="Peru">Peru</option>
                                        <option value="Venezuela">Venezuela</option>
                                        <option value="Mexico">Mexico</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {addressFormErrors.country && (
                                        <p className="text-xs text-red-600 mt-1">{addressFormErrors.country}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 mt-8">
                                <button
                                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition focus:outline-none border-none"
                                    onClick={() => setShowUpdateAddressModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={`px-6 py-3 rounded-xl font-semibold transition focus:outline-none border-none ${!isProcessing
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-blue-300 text-blue-500 cursor-not-allowed'
                                        }`}
                                    onClick={handleSaveAddress}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Saving...
                                        </div>
                                    ) : (
                                        subscriber?.billingAddress ? 'Update Address' : 'Add Address'
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Success Notification */}
                {showSuccessNotification && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -50, scale: 0.9 }}
                        className="fixed top-4 right-4 z-50"
                    >
                        <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
                            <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                                <span className="text-green-800 text-sm">✓</span>
                            </div>
                            <div>
                                <div className="font-semibold">Success!</div>
                                <div className="text-sm">{successMessage}</div>
                            </div>
                            <button
                                onClick={() => setShowSuccessNotification(false)}
                                className="ml-4 text-green-100 hover:text-white transition"
                            >
                                ×
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </SubscriberDashboardLayout>
    );
};

export default Billings; 