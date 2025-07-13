'use client';
import React from 'react';
import { SparklesIcon } from '../icons';
import { kudosOptions, features } from '../../lib/data';

export function KudosModal({ item, onClose, onPayItForward }: { item: any, onClose: () => void, onPayItForward: (item: any) => void }) {
    if (!item) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 modal-backdrop" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md modal-content text-center" onClick={e => e.stopPropagation()}>
                <div className="text-green-500 mx-auto bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-4"><SparklesIcon /></div>
                <h2 className="text-2xl font-bold mb-2">Exchange Complete!</h2>
                <p className="text-slate-600 mb-6">You completed the request for <span className="font-semibold text-indigo-600">"{item.title}"</span>. Give some kudos to the community member who helped you!</p>
                <div className="flex flex-wrap justify-center gap-3 mb-8">{kudosOptions.map(kudo => (<button key={kudo} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full font-medium hover:bg-indigo-100 hover:text-indigo-700 transition">{kudo}</button>))}</div>
                {features.enablePayItForward && item.category === 'Skills' && (
                     <button onClick={() => onPayItForward(item)} className="w-full px-6 py-3 mb-3 bg-violet-100 text-violet-800 rounded-lg font-semibold hover:bg-violet-200 transition">Pay this skill forward</button>
                )}
                <button onClick={onClose} className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">Done</button>
            </div>
        </div>
    );
}