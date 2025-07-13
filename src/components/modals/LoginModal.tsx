'use client';
import { Auth } from '@supabase/auth-ui-react';
import { useSupabase } from '../../app/supabase-provider';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const { supabase } = useSupabase();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 modal-backdrop" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md modal-content" onClick={e => e.stopPropagation()}>
                <h1 className="text-3xl font-bold text-center mb-4 text-slate-900">Join FutureBank</h1>
                <p className="text-slate-600 text-center mb-8">Create an account to start exchanging with your community.</p>
                <Auth
                    supabaseClient={supabase}
                    view="sign_up" // Can be 'sign_in' or 'sign_up'
                    providers={['google']}
                    redirectTo={`${window.location.origin}/auth/callback`}
                    additionalData={{
                        // This is how we pass the username to the database function
                        // Note: The Auth component doesn't have a built-in username field,
                        // so this is a conceptual placeholder. A custom form would be needed for a real app.
                        // For now, the database function will handle creating a profile.
                    }}
                />
            </div>
        </div>
    );
}