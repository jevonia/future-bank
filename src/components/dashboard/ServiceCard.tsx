'use client';
import React from 'react';
import { CheckCircleIcon, ZapIcon } from '../icons';
import { features } from '../../lib/data';

export function ServiceCard({ item, type, onComplete, onAmplify }: { item: any, type: 'offer' | 'want', onComplete?: (item: any) => void, onAmplify?: (item: any) => void }) {
    const categoryColor: { [key: string]: string } = { Creative: 'bg-pink-100 text-pink-800', Tech: 'bg-sky-100 text-sky-800', Lifestyle: 'bg-teal-100 text-teal-800', Repair: 'bg-orange-100 text-orange-800', Skills: 'bg-green-100 text-green-800', Language: 'bg-yellow-100 text-yellow-800' };
    return (
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 card-hover">
            <div className="flex justify-between items-start gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        {item.value && type === 'offer' && <span className="text-sm font-bold text-indigo-600">{item.value}</span>}
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${categoryColor[item.category] || 'bg-slate-200 text-slate-800'}`}>{item.category}</span>
                    </div>
                    <h3 className="font-semibold text-slate-900">{item.title}</h3>
                    <p className="text-sm text-slate-600">{item.description}</p>
                </div>
                {type === 'want' && features.enableRequestAmplification && onAmplify && (
                    <button onClick={() => onAmplify(item)} title="Amplify Request" className="flex-shrink-0 text-slate-400 hover:text-yellow-500 transition"><ZapIcon /></button>
                )}
            </div>
            {type === 'want' && onComplete && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                    <button onClick={() => onComplete(item)} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold hover:bg-green-200 transition">
                        <CheckCircleIcon />
                        <span>Mark as Complete & Give Kudos</span>
                    </button>
                </div>
            )}
        </div>
    );
}