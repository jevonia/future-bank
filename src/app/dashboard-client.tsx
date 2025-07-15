'use client';

import React, { useState, useEffect } from 'react';
import type { AppState } from '@/lib/types';

// Import Components
import { Header } from '../components/dashboard/Header';
import { DashboardCard } from '../components/dashboard/DashboardCard';
import { ServiceCard } from '../components/dashboard/ServiceCard';
import { CommunityPulse } from '../components/dashboard/CommunityPulse';
import { ContributionConstellation } from '../components/dashboard/ContributionConstellation';
import { CommunityProjects } from '../components/dashboard/CommunityProjects';
import { CommunityFund } from '../components/dashboard/CommunityFund';
import { AddOfferModal } from '../components/modals/AddOfferModal';
import { AddWantModal } from '../components/modals/AddWantModal';
import { LoginModal } from '../components/modals/LoginModal';
import { SearchIcon } from '../components/icons';

// Import mock data for features that are not yet dynamic
import { communityPulseData, contributionData, communityProjects, communityFundData, features } from '../lib/data';

export default function DashboardClient({ serverState }: { serverState: AppState }) {
    const [appState, setAppState] = useState(serverState);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isAddOfferModalOpen, setIsAddOfferModalOpen] = useState(false);
    const [isAddWantModalOpen, setIsAddWantModalOpen] = useState(false);

    useEffect(() => {
        if (appState.user) {
            setIsLoginModalOpen(false);
        }
    }, [appState.user]);

    // In a real app, we would fetch new data here after an offer is added.
    const handleOfferAdded = () => {
        setIsAddOfferModalOpen(false);
        // We would re-fetch data here. For now, we just close the modal.
    };

    const handleWantAdded = () => {
        setIsAddWantModalOpen(false);
        // We would re-fetch data here. For now, we just close the modal.
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <Header 
                user={appState.user}
                profile={appState.profile}
                onSignInClick={() => setIsLoginModalOpen(true)} 
            />
            <main className="p-4 sm:p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    
                    {/* Publicly Visible Components */}
                    {features.showCommunityPulse && <CommunityPulse data={communityPulseData} />}
                    {features.showGroupProjects && <CommunityProjects projects={communityProjects} />}
                    {features.showCommunityFund && <CommunityFund data={communityFundData} onInteract={() => appState.user ? console.log('Open Fund Modal') : setIsLoginModalOpen(true)} />}
                    
                    {/* Logged-In Only Components */}
                    {appState.user && (
                        <>
                            <DashboardCard title="My Offers" onAdd={() => setIsAddOfferModalOpen(true)}>
                                <div className="space-y-4">{appState.offers.map(offer => <ServiceCard key={offer.id} item={offer} type="offer" />)}</div>
                            </DashboardCard>
                            <DashboardCard title="My Wants" onAdd={() => setIsAddWantModalOpen(true)}>
                                <div className="space-y-4">{appState.wants.map(want => <ServiceCard key={want.id} item={want} type="want" />)}</div>
                            </DashboardCard>
                            {features.showContributionConstellation && <ContributionConstellation data={contributionData} />}
                        </>
                    )}

                    <DashboardCard title="Community Marketplace">
                        <p className="text-sm text-slate-500 mb-4">Discover skills and services offered by others.</p>
                        <div className="relative mb-4"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><SearchIcon /></div><input type="text" placeholder="Search for services..." className="w-full p-3 pl-12 bg-slate-100 rounded-lg border-2 border-transparent focus:border-indigo-500 focus:bg-white focus:outline-none transition" /></div>
                    </DashboardCard>
                </div>
            </main>
            
            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
            <AddOfferModal 
                isOpen={isAddOfferModalOpen} 
                onClose={() => setIsAddOfferModalOpen(false)} 
                onOfferAdded={handleOfferAdded} 
            />
            <AddWantModal 
                isOpen={isAddWantModalOpen} 
                onClose={() => setIsAddWantModalOpen(false)} 
                onWantAdded={handleWantAdded} 
            />
        </div>
    );
}