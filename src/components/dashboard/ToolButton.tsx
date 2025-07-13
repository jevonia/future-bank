'use client';
import React from 'react';

export function ToolButton({ icon, label }: { icon: React.ReactNode, label: string }) {
    return (
        <button className="w-full flex flex-col items-center justify-center p-4 bg-slate-100 rounded-xl text-slate-700 font-semibold hover:bg-indigo-100 hover:text-indigo-700 transition card-hover border border-slate-200">
            <div className="mb-2">{icon}</div>
            <span className="text-sm">{label}</span>
        </button>
    );
}