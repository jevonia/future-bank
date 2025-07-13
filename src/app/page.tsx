'use client';

import React, { useState } from 'react';
import { useSupabase } from './supabase-provider';

// Import Data (will be replaced with live data later)
import { userData, userOffers, userWants, communityPulseData, contributionData, communityProjects, communityFundData, features } from '../lib/data';

// Import Components
import { Header } from '../components/dashboard/Header';
import { DashboardCard } from '../components/dashboard/DashboardCard';
import { ServiceCard } from '../components/dashboard/ServiceCard';
import { CommunityPulse } from '../components/dashboard/CommunityPulse';
import { ContributionConstellation } from '../components/dashboard/ContributionConstellation';
import { CommunityProjects } from '../components/dashboard/CommunityProjects';
import { CommunityFund } from '../components/dashboard/CommunityFund';
import { ToolButton } from '../components/dashboard/ToolButton';
import { AddOfferModal } from '../components/modals/AddOfferModal';
import { KudosModal } from '../components/modals/KudosModal';
import { WelcomeModal } from '../components/modals/WelcomeModal';
import { CommunityFundModal } from '../components/modals/CommunityFundModal';
import { AmplifyModal } from '../components/modals/AmplifyModal';
import { LoginModal } from '../components/modals/LoginModal'; // New Import
import { ClockIcon, CalendarIcon, ListIcon, SearchIcon } from '../components/icons';

export default function DashboardPage() {
    const { session } = useSupabase();

    // State for modals
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isAddOfferModalOpen, setIsAddOfferModalOpen] = useState(false);
    // ... other modal states ...

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <Header onSignInClick={() => setIsLoginModalOpen(true)} />
            <main className="p-4 sm:p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    
                    {/* Publicly Visible Components */}
                    {features.showCommunityPulse && <CommunityPulse data={communityPulseData} />}
                    {features.showGroupProjects && <CommunityProjects projects={communityProjects} />}
                    {features.showCommunityFund && <CommunityFund data={communityFundData} onInteract={() => session ? console.log('Open Fund Modal') : setIsLoginModalOpen(true)} />}
                    
                    {/* Logged-In Only Components */}
                    {session && (
                        <>
                            <DashboardCard title="My Offers" onAdd={() => setIsAddOfferModalOpen(true)}>
                                <div className="space-y-4">{userOffers.map(offer => <ServiceCard key={offer.id} item={offer} type="offer" />)}</div>
                            </DashboardCard>
                            <DashboardCard title="My Wants">
                                <div className="space-y-4">{userWants.map(want => <ServiceCard key={want.id} item={want} type="want" />)}</div>
                            </DashboardCard>
                            {features.showContributionConstellation && <ContributionConstellation data={contributionData} />}
                        </>
                    )}

                    <DashboardCard title="Community Marketplace">
                        <p className="text-sm text-slate-500 mb-4">Discover great new skills and services offered by others.</p>
                        <div className="relative mb-4"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><SearchIcon /></div><input type="text" placeholder="Search for services..." className="w-full p-3 pl-12 bg-slate-100 rounded-lg border-2 border-transparent focus:border-indigo-500 focus:bg-white focus:outline-none transition" /></div>
                    </DashboardCard>

                </div>
            </main>
            
            {/* Render all modals here */}
            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
            <AddOfferModal isOpen={isAddOfferModalOpen} onClose={() => setIsAddOfferModalOpen(false)} />
            {/* ... other modals ... */}
        </div>
    );
}