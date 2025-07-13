'use client';
import React from 'react';
import { DashboardCard } from './DashboardCard';
import { HeartIcon } from '../icons';

export function CommunityFund({ data, onInteract }: { data: any, onInteract: () => void }) {
    return (
        <DashboardCard title="The Community Fund">
            <div className="text-center bg-violet-600 text-white rounded-lg p-6 mb-4">
                <h3 className="text-sm font-medium uppercase tracking-wider opacity-80">Total in Fund</h3>
                <p className="text-5xl font-extrabold balance-glow">{data.balance.toFixed(1)}</p>
                <p className="text-lg font-bold">Time Credits</p>
            </div>
            <p className="text-sm text-slate-500 mb-4">A shared pool of hours for members in need. Give what you can, take what you need.</p>
            <div className="grid grid-cols-2 gap-3">
                <button onClick={onInteract} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-100 text-green-800 rounded-lg font-semibold hover:bg-green-200 transition">
                    <HeartIcon />
                    <span>Donate TC</span>
                </button>
                 <button onClick={onInteract} className="w-full px-4 py-3 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition">Request from Fund</button>
            </div>
        </DashboardCard>
    );
}