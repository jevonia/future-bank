'use client';
import React from 'react';
import { DashboardCard } from './DashboardCard';

export function ContributionConstellation({ data }: { data: any[] }) {
    const starColors: { [key: string]: string } = { Creative: 'text-pink-400', Tech: 'text-sky-400', Lifestyle: 'text-teal-400', Repair: 'text-orange-400', Skills: 'text-green-400', Language: 'text-yellow-400' };
    
    const Star = ({ type, count, index }: { type: string, count: number, index: number }) => {
        const color = starColors[type] || 'text-slate-400';
        const hash = (s: string) => s.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
        const x = (Math.abs(hash(type)) % 80) + 10;
        const y = (Math.abs(hash(type.split('').reverse().join(''))) % 70) + 15;
        const size = 12 + Math.min(count * 2, 16);
        const glow = `drop-shadow(0 0 5px ${color.replace('text-','').replace('-400','rgba(255,255,255,0.7)')})`;

        return (
            <div
                className="constellation-star absolute group flex flex-col items-center"
                style={{ left: `${x}%`, top: `${y}%`, transform: 'translateX(-50%)', animationDelay: `${index * 100}ms` }}
                title={`${type} (${count} contributions)`}
            >
                <svg className={`${color}`} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ filter: glow }}>
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
                <span className="text-white font-bold text-xs mt-1" style={{ textShadow: '0 0 3px black' }}>
                    {count}
                </span>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-slate-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {type}
                </div>
            </div>
        );
    };

    return (
        <DashboardCard title="My Contribution Constellation">
            <p className="text-sm text-slate-500 mb-4">A unique constellation that grows with every contribution you make.</p>
            <div className="relative h-56 bg-slate-800 rounded-lg overflow-hidden p-2">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-700 via-slate-900 to-black"></div>
                {data.map((item, i) => <Star key={i} type={item.type} count={item.count} index={i} />)}
            </div>
        </DashboardCard>
    );
}
