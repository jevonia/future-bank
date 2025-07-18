'use client';
import React from 'react';
import { PlusIcon } from '../icons';

interface DashboardCardProps {
    title: string;
    children: React.ReactNode;
    onAdd?: () => void;
    disabled?: boolean;
}

export function DashboardCard({ title, children, onAdd, disabled = false }: DashboardCardProps) {
    return (
        <div className={`bg-white rounded-2xl shadow-lg p-6 ${disabled ? 'opacity-50' : ''}`}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                {onAdd && !disabled && (
                    <button onClick={onAdd} className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow-sm">
                        <PlusIcon />
                        <span>Add New</span>
                    </button>
                )}
                {onAdd && disabled && (
                    <button disabled className="flex items-center space-x-2 px-4 py-2 bg-slate-400 text-white rounded-lg font-semibold cursor-not-allowed">
                        <PlusIcon />
                        <span>Add New</span>
                    </button>
                )}
            </div>
            {children}
        </div>
    );
}

