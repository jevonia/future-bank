'use client';
import React from 'react';
import { DashboardCard } from './DashboardCard';

export function CommunityPulse({ data }: { data: any }) {
    const Stat = ({ value, label }: {value: number, label: string}) => (
        <div className="text-center">
            <p className="text-3xl font-bold text-indigo-600">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
        </div>
    );
    return (
        <DashboardCard title="Community Pulse">
            <p className="text-sm text-slate-500 mb-6">A snapshot of our collective activity.</p>
            <div className="grid grid-cols-3 gap-4">
                <Stat value={data.exchangesThisWeek} label="Exchanges This Week" />
                <Stat value={data.newMembers} label="New Members" />
                <Stat value={data.activeProjects} label="Active Projects" />
            </div>
        </DashboardCard>
    );
}
