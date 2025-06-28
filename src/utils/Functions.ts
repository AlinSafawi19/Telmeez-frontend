/**
 * Translates server error messages for newsletter functionality
 * @param serverMessage - The error message from the server
 * @param translations - The current language translations
 * @returns The translated error message
 */
export const translateNewsletterError = (serverMessage: string, translations: any): string => {
    const serverErrors = translations.newsletter?.errors?.server_errors;
    
    if (!serverErrors) {
        return serverMessage; // Fallback to original message if translations not available
    }

    // Map server messages to translation keys
    const errorMapping: { [key: string]: string } = {
        'Email is required': serverErrors.email_required,
        'Please enter a valid email address': serverErrors.invalid_email,
        'You\'re already part of our newsletter family! 🎉': serverErrors.already_subscribed,
        'This email is already unsubscribed from our newsletter': serverErrors.already_unsubscribed,
        'Email not found in our newsletter subscriptions': serverErrors.email_not_found,
        'An error occurred while subscribing to the newsletter': serverErrors.subscription_error,
        'An error occurred while unsubscribing from the newsletter': serverErrors.unsubscription_error,
        'Welcome back! We\'re thrilled to have you rejoin our newsletter family! 🎉': serverErrors.resubscribed,
        'Thank you for joining our newsletter! Welcome to the Telmeez family! 🎉': serverErrors.subscribed,
        'We\'ll miss you! You\'ve been unsubscribed successfully. 👋': serverErrors.unsubscribed
    };

    return errorMapping[serverMessage] || serverMessage;
};
