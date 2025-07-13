'use client';
import React from 'react';
import { DashboardCard } from './DashboardCard';

function ProjectCard({ project }: { project: any }) {
    const progress = (project.current / project.goal) * 100;
    const categoryColor: { [key: string]: string } = { Creative: 'bg-pink-100 text-pink-800', Tech: 'bg-sky-100 text-sky-800', Lifestyle: 'bg-teal-100 text-teal-800', Repair: 'bg-orange-100 text-orange-800', Skills: 'bg-green-100 text-green-800', Language: 'bg-yellow-100 text-yellow-800' };
    const progressColor: { [key: string]: string } = { Creative: 'bg-pink-500', Tech: 'bg-sky-500', Lifestyle: 'bg-teal-500', Repair: 'bg-orange-500', Skills: 'bg-green-500', Language: 'bg-yellow-500' };
    
    return (
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 card-hover">
            <div className="flex items-center gap-3 mb-2"><span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${categoryColor[project.category] || 'bg-slate-200 text-slate-800'}`}>{project.category}</span></div>
            <h3 className="font-semibold text-slate-900">{project.title}</h3>
            <p className="text-sm text-slate-600 mb-3">{project.description}</p>
            <div className="mb-2">
                <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
                    <span>Progress</span>
                    <span>{project.current.toFixed(1)} / {project.goal} TC</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div className={`h-2.5 rounded-full ${progressColor[project.category] || 'bg-slate-600'}`} style={{ width: `${progress}%` }}></div>
                </div>
            </div>
            <div className="flex justify-between items-center mt-3">
                <div className="flex items-center -space-x-2">
                    {project.participants.map((p: string, i: number) => (
                        <img key={i} className="h-8 w-8 rounded-full border-2 border-white" src={`https://placehold.co/40x40/64748B/FFFFFF?text=${p}`} alt={`Participant ${p}`} />
                    ))}
                    {project.participants.length > 0 && <span className="pl-4 text-xs text-slate-500 font-medium">{project.participants.length} contributors</span>}
                </div>
                <button className="px-4 py-2 bg-indigo-100 text-indigo-800 text-sm rounded-lg font-semibold hover:bg-indigo-200 transition">Contribute</button>
            </div>
        </div>
    );
}

export function CommunityProjects({ projects }: { projects: any[] }) {
    return (
        <DashboardCard title="Community Projects">
             <p className="text-sm text-slate-500 mb-4">Join others to accomplish bigger goals together.</p>
             <div className="space-y-4">
                {projects.map(project => <ProjectCard key={project.id} project={project} />)}
             </div>
        </DashboardCard>
    );
}