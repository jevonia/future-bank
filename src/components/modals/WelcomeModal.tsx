'use client';
import React from 'react';

export function WelcomeModal({ isOpen, onClose, user }: { isOpen: boolean, onClose: () => void, user: any }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 modal-backdrop">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md modal-content text-center" onClick={e => e.stopPropagation()}>
                <img src={user.avatarUrl} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-violet-300" />
                <h2 className="text-3xl font-bold mb-2">Welcome to FutureBank, {user.name}!</h2>
                <p className="text-slate-600 mb-6">We're so happy you're here. This is a place to share skills, build connections, and strengthen our community together.</p>
                <p className="text-slate-500 text-sm mb-6">Your first quest: add a skill you can offer or a need you have. Every contribution helps our ecosystem grow!</p>
                <button onClick={onClose} className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">Let's Get Started</button>
            </div>
        </div>
    );
}
