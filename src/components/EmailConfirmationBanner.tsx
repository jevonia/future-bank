'use client';
import React from 'react';
import { useAuth } from '@/lib/hooks/useAuth';

export function EmailConfirmationBanner() {
    const { user } = useAuth();

    // Only show if user is logged in but email is not confirmed
    if (!user || user.email_confirmed_at) {
        return null;
    }

    return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                        Email confirmation required
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                        <p>
                            Please check your email and click the confirmation link to verify your account. 
                            You'll need to confirm your email before you can create offers or wants.
                        </p>
                        <p className="mt-1">
                            Didn't receive the email? Check your spam folder or{' '}
                            <button 
                                className="font-medium underline hover:text-yellow-600"
                                onClick={async () => {
                                    // Resend confirmation email
                                    const { error } = await fetch('/api/auth/resend-confirmation', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ email: user.email })
                                    }).then(res => res.json());
                                    
                                    if (error) {
                                        alert('Error sending confirmation email: ' + error);
                                    } else {
                                        alert('Confirmation email sent! Check your inbox.');
                                    }
                                }}
                            >
                                resend it
                            </button>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
} 