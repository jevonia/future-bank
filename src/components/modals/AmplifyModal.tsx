'use client';
import React from 'react';
import { ZapIcon } from '../icons';

export function AmplifyModal({ item, onClose }: { item: any, onClose: () => void }) {
    if (!item) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 modal-backdrop" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md modal-content text-center" onClick={e => e.stopPropagation()}>
                <div className="text-yellow-500 mx-auto bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mb-4"><ZapIcon /></div>
                <h2 className="text-2xl font-bold mb-2">Amplify This Request?</h2>
                <p className="text-slate-600 mb-6">Amplifying <span className="font-semibold text-indigo-600">"{item.title}"</span> will send a high-priority alert to members who have opted-in to receive urgent notifications.</p>
                <p className="text-sm text-slate-500 mb-6">Please use this for time-sensitive or critical needs.</p>
                <div className="flex justify-center space-x-4">
                    <button onClick={onClose} className="px-8 py-3 bg-slate-200 text-slate-800 rounded-lg font-semibold hover:bg-slate-300 transition">Cancel</button>
                    <button onClick={onClose} className="px-8 py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition">Yes, Amplify</button>
                </div>
            </div>
        </div>
    );
}