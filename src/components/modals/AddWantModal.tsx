'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/hooks/useAuth';
import { WANT_CRITERIA, CRITERIA_LABELS, type WantCriteria } from '../../lib/types';

interface AddWantModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: any;
    onWantAdded?: () => void;
}

export function AddWantModal({ isOpen, onClose, initialData, onWantAdded }: AddWantModalProps) {
    const { user, supabase } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Misc');
    const [selectedCriteria, setSelectedCriteria] = useState<WantCriteria[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setDescription(initialData.description || '');
            setCategory(initialData.category || 'Misc');
            setSelectedCriteria(initialData.criteria || []);
        } else {
            setTitle('');
            setDescription('');
            setCategory('Misc');
            setSelectedCriteria([]);
        }
    }, [initialData, isOpen]);

    const handleCriteriaToggle = (criterion: WantCriteria) => {
        setSelectedCriteria(prev => 
            prev.includes(criterion) 
                ? prev.filter(c => c !== criterion)
                : [...prev, criterion]
        );
    };

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
            alert("You must be logged in to create a want.");
            return;
        }
        setLoading(true);

        // Ensure profile exists before creating want
        const profileExists = await ensureProfileExists();
        if (!profileExists) {
            alert('Error: Unable to create or verify user profile. Please try again.');
            setLoading(false);
            return;
        }

        const { error } = await supabase
            .from('wants')
            .insert([
                { 
                    title, 
                    description, 
                    category,
                    criteria: selectedCriteria,
                    user_id: user.id 
                }
            ]);

        if (error) {
            alert('Error creating want: ' + error.message);
        } else {
            if (onWantAdded && typeof onWantAdded === 'function') {
                onWantAdded();
            }
            onClose();
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-backdrop" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto modal-content" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4">Add a New Want</h2>
                <p className="text-slate-500 mb-6">Describe what you need help with and any specific requirements you have.</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                        <input 
                            type="text" 
                            value={title} 
                            onChange={e => setTitle(e.target.value)} 
                            placeholder="e.g., Help with Bike Repair" 
                            className="w-full p-3 bg-slate-100 rounded-lg border-2 border-transparent focus:border-indigo-500 focus:bg-white focus:outline-none transition" 
                            required 
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea 
                            rows={3} 
                            value={description} 
                            onChange={e => setDescription(e.target.value)} 
                            placeholder="e.g., My bike's chain keeps slipping and I need help fixing it. I'm a beginner with bike maintenance." 
                            className="w-full p-3 bg-slate-100 rounded-lg border-2 border-transparent focus:border-indigo-500 focus:bg-white focus:outline-none transition"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                        <input 
                            type="text" 
                            value={category} 
                            onChange={e => setCategory(e.target.value)} 
                            placeholder="e.g., Repair, Skills, Language" 
                            className="w-full p-3 bg-slate-100 rounded-lg border-2 border-transparent focus:border-indigo-500 focus:bg-white focus:outline-none transition" 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">Criteria (Optional)</label>
                        <p className="text-sm text-slate-500 mb-4">Select any requirements or preferences for this request:</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {WANT_CRITERIA.map((criterion) => (
                                <label 
                                    key={criterion} 
                                    className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition ${
                                        selectedCriteria.includes(criterion)
                                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedCriteria.includes(criterion)}
                                        onChange={() => handleCriteriaToggle(criterion)}
                                        className="sr-only"
                                    />
                                    <div className={`w-4 h-4 rounded border-2 mr-3 flex-shrink-0 ${
                                        selectedCriteria.includes(criterion)
                                            ? 'border-indigo-500 bg-indigo-500'
                                            : 'border-slate-300'
                                    }`}>
                                        {selectedCriteria.includes(criterion) && (
                                            <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="text-sm font-medium">{CRITERIA_LABELS[criterion]}</span>
                                </label>
                            ))}
                        </div>
                    </div>

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
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition" 
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Add Want'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 