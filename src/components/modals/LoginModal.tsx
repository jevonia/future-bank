'use client';
import { Auth } from '@supabase/auth-ui-react';
import { createClient } from '@/lib/supabase/client';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const supabase = createClient();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 modal-backdrop" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md modal-content" onClick={e => e.stopPropagation()}>
                <h1 className="text-3xl font-bold text-center mb-4 text-slate-900">Join FutureBank</h1>
                <p className="text-slate-600 text-center mb-8">Sign in or create an account to start exchanging.</p>
                <Auth
                    supabaseClient={supabase}
                    theme="dark"
                    providers={['google']}
                    redirectTo={`${window.location.origin}/auth/callback`}
                />
            </div>
        </div>
    );
}
