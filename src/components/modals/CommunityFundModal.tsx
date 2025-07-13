'use client';
import React, { useState } from 'react';

export function CommunityFundModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [tab, setTab] = useState('donate'); // 'donate' or 'request'
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 modal-backdrop" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg modal-content" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-2">The Community Fund</h2>
                <p className="text-slate-500 mb-6">A safety net built by all of us, for all of us.</p>
                <div className="flex border-b border-slate-200 mb-6">
                    <button onClick={() => setTab('donate')} className={`px-4 py-3 font-semibold ${tab === 'donate' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}>Donate Credits</button>
                    <button onClick={() => setTab('request')} className={`px-4 py-3 font-semibold ${tab === 'request' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}>Request Credits</button>
                </div>
                {tab === 'donate' && (
                    <form className="space-y-4">
                        <p className="text-sm text-slate-600">Your donation helps members who are in crisis or unable to earn credits. Thank you for your solidarity!</p>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Amount to Donate (TC)</label><input type="number" step="0.5" placeholder="e.g., 2.5" className="w-full p-3 bg-slate-100 rounded-lg border-2 border-transparent focus:border-indigo-500 focus:bg-white focus:outline-none transition"/></div>
                        <div className="flex justify-end space-x-4 pt-4"><button type="button" onClick={onClose} className="px-6 py-2 bg-slate-200 text-slate-800 rounded-lg font-semibold hover:bg-slate-300 transition">Cancel</button><button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">Confirm Donation</button></div>
                    </form>
                )}
                {tab === 'request' && (
                     <form className="space-y-4">
                        <p className="text-sm text-slate-600">Requests are confidential and reviewed by community facilitators. Please describe your need briefly.</p>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Amount Requested (TC)</label><input type="number" step="0.5" placeholder="e.g., 5.0" className="w-full p-3 bg-slate-100 rounded-lg border-2 border-transparent focus:border-indigo-500 focus:bg-white focus:outline-none transition"/></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Reason for Request (Private)</label><textarea rows="3" placeholder="e.g., Facing a health issue and need help with meals." className="w-full p-3 bg-slate-100 rounded-lg border-2 border-transparent focus:border-indigo-500 focus:bg-white focus:outline-none transition"></textarea></div>
                        <div className="flex justify-end space-x-4 pt-4"><button type="button" onClick={onClose} className="px-6 py-2 bg-slate-200 text-slate-800 rounded-lg font-semibold hover:bg-slate-300 transition">Cancel</button><button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">Submit Request</button></div>
                    </form>
                )}
            </div>
        </div>
    );
}