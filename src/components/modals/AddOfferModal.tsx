'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/hooks/useAuth';

interface AddOfferModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: any;
    onOfferAdded?: () => void; // Make this optional
}

export function AddOfferModal({ isOpen, onClose, initialData, onOfferAdded }: AddOfferModalProps) {
    const { user, supabase } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Misc');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description);
        } else {
            setTitle('');
            setDescription('');
            setCategory('Misc');
        }
    }, [initialData, isOpen]);

    const ensureProfileExists = async () => {
        if (!user) return false;
        
        // Check if profile exists
        const { data: existingProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .single();

        if (fetchError && fetchError.code === 'PGRST116') {
            // Profile doesn't exist, create one
            const { error: insertError } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: user.id,
                        username: user.email?.split('@')[0] || 'User',
                        avatar_url: null,
                        time_balance: 0.0  // Use double precision
                    }
                ]);

            if (insertError) {
                console.error('Error creating profile:', insertError);
                return false;
            }
            return true;
        }

        return !fetchError;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!user) {
            alert("You must be logged in to create an offer.");
            return;
        }
        setLoading(true);

        // Ensure profile exists before creating offer
        const profileExists = await ensureProfileExists();
        if (!profileExists) {
            alert('Error: Unable to create or verify user profile. Please try again.');
            setLoading(false);
            return;
        }

        const { error } = await supabase
            .from('offers')
            .insert([
                { 
                    title, 
                    description, 
                    category,
                    user_id: user.id 
                }
            ]);

        if (error) {
            alert('Error creating offer: ' + error.message);
        } else {
            // Add safety check before calling the function
            if (onOfferAdded && typeof onOfferAdded === 'function') {
                onOfferAdded();
            }
            // Always close the modal after successful submission
            onClose();
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-backdrop" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg modal-content" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4">Add a New Offer</h2>
                <p className="text-slate-500 mb-6">Describe the skill or service you&apos;d like to provide to the community.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Dog Walking" className="w-full p-3 bg-slate-100 rounded-lg border-2 border-transparent focus:border-indigo-500 focus:bg-white focus:outline-none transition" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g., Available for 30-minute walks on weekday mornings." className="w-full p-3 bg-slate-100 rounded-lg border-2 border-transparent focus:border-indigo-500 focus:bg-white focus:outline-none transition"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                        <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g., Creative, Tech, Repair" className="w-full p-3 bg-slate-100 rounded-lg border-2 border-transparent focus:border-indigo-500 focus:bg-white focus:outline-none transition" />
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-slate-200 text-slate-800 rounded-lg font-semibold hover:bg-slate-300 transition">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition" disabled={loading}>
                            {loading ? 'Saving...' : 'Add Offer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}