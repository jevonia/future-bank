'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/hooks/useAuth';
import type { Profile } from '../../lib/types';

interface ProfileSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: Profile | null;
    onProfileUpdated?: () => void;
}

export function ProfileSettingsModal({ isOpen, onClose, profile, onProfileUpdated }: ProfileSettingsModalProps) {
    const { user, supabase } = useAuth();
    const [username, setUsername] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (profile) {
            setUsername(profile.username || '');
            setAvatarUrl(profile.avatar_url || '');
        }
    }, [profile, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        setError('');
        setSuccess('');

        // Validate username
        if (username.length < 3 || username.length > 20) {
            setError('Username must be between 3 and 20 characters');
            setLoading(false);
            return;
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            setError('Username can only contain letters, numbers, and underscores');
            setLoading(false);
            return;
        }

        // Check if username is already taken (excluding current user)
        const { data: existingUser } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', username)
            .neq('id', user.id)
            .single();

        if (existingUser) {
            setError('Username is already taken');
            setLoading(false);
            return;
        }

        // Update profile
        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                username: username,
                avatar_url: avatarUrl || null
            })
            .eq('id', user.id);

        if (updateError) {
            setError('Error updating profile: ' + updateError.message);
        } else {
            setSuccess('Profile updated successfully!');
            if (onProfileUpdated) {
                onProfileUpdated();
            }
            // Close modal after a short delay to show success message
            setTimeout(() => {
                onClose();
            }, 1500);
        }

        setLoading(false);
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setLoading(true);
        setError('');

        // For now, we'll use a placeholder service
        // In a real app, you'd upload to Supabase Storage or another service
        const reader = new FileReader();
        reader.onload = (event) => {
            setAvatarUrl(event.target?.result as string);
            setLoading(false);
        };
        reader.readAsDataURL(file);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-backdrop" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg modal-content" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
                <p className="text-slate-500 mb-6">Update your profile information and preferences.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar Section */}
                    <div className="text-center">
                        <div className="relative inline-block">
                            <div className="w-24 h-24 bg-violet-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto">
                                {avatarUrl ? (
                                    <img 
                                        src={avatarUrl} 
                                        alt="Avatar" 
                                        className="w-24 h-24 rounded-full object-cover"
                                    />
                                ) : (
                                    username.charAt(0).toUpperCase()
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Username Field */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Choose a username"
                            className="w-full p-3 bg-slate-100 rounded-lg border-2 border-transparent focus:border-indigo-500 focus:bg-white focus:outline-none transition"
                            required
                            minLength={3}
                            maxLength={20}
                        />
                        <p className="text-xs text-slate-500 mt-1">3-20 characters, letters, numbers, and underscores only</p>
                    </div>

                    {/* Email Display (Read-only) */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            className="w-full p-3 bg-slate-50 rounded-lg border-2 border-slate-200 text-slate-500"
                            disabled
                        />
                        <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                    </div>

                    {/* Time Balance Display (Read-only) */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Time Credit Balance</label>
                        <div className="w-full p-3 bg-slate-50 rounded-lg border-2 border-slate-200">
                            <span className="text-2xl font-bold text-violet-500">{profile?.time_balance?.toFixed(1) || '0.0'} TC</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Earn credits by helping others</p>
                    </div>

                    {/* Error/Success Messages */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-600">{success}</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 bg-slate-200 text-slate-800 rounded-lg font-semibold hover:bg-slate-300 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 