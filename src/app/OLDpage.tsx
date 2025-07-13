'use client';

import React, { useState } from 'react';

// Import Data
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
import { ClockIcon, CalendarIcon, ListIcon, SearchIcon } from '../components/icons';


export default function DashboardPage() {
    const [balance, setBalance] = useState(userData.balance);
    const [pulse, setPulse] = useState(false);
    const [showWelcome, setShowWelcome] = useState(features.showWelcomeRitual);
    const [showKudos, setShowKudos] = useState<any>(null);
    const [isAddOfferModalOpen, setIsAddOfferModalOpen] = useState(false);
    const [payItForwardData, setPayItForwardData] = useState<any>(null);
    const [isFundModalOpen, setIsFundModalOpen] = useState(false);
    const [isAmplifyModalOpen, setIsAmplifyModalOpen] = useState<any>(null);

    const handleCompleteExchange = (item: any) => {
        setBalance(prev => prev + item.value);
        setPulse(true);
        setTimeout(() => setPulse(false), 500);
        if (features.enableKudosSystem) setShowKudos(item);
    };

    const handlePayItForward = (item: any) => {
        const prefill = { title: `Offering beginner ${item.title.split(' Lessons')[0]} tips`, description: `Inspired by a great community exchange, I'd like to share what I've learned about ${item.title.toLowerCase()}!` };
        setPayItForwardData(prefill);
        setShowKudos(null);
        setIsAddOfferModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <Header user={userData} balance={balance} pulse={pulse} />
            <main className="p-4 sm:p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {features.showCommunityPulse && <CommunityPulse data={communityPulseData} />}
                    <DashboardCard title="My Offers" onAdd={() => { setPayItForwardData(null); setIsAddOfferModalOpen(true); }}>
                        <div className="space-y-4">{userOffers.map(offer => <ServiceCard key={offer.id} item={offer} type="offer" />)}</div>
                    </DashboardCard>
                    <DashboardCard title="My Wants">
                         <div className="space-y-4">{userWants.map(want => <ServiceCard key={want.id} item={want} type="want" onComplete={handleCompleteExchange} onAmplify={() => setIsAmplifyModalOpen(want)} />)}</div>
                    </DashboardCard>
                    {features.showContributionConstellation && <ContributionConstellation data={contributionData} />}
                    {features.showGroupProjects && <CommunityProjects projects={communityProjects} />}
                    {features.showCommunityFund && <CommunityFund data={communityFundData} onInteract={() => setIsFundModalOpen(true)} />}
                    <DashboardCard title="Community Marketplace">
                        <p className="text-sm text-slate-500 mb-4">Discover skills and services offered by others.</p>
                        <div className="relative mb-4"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><SearchIcon /></div><input type="text" placeholder="Search for services (e.g., 'dog walking')" className="w-full p-3 pl-12 bg-slate-100 rounded-lg border-2 border-transparent focus:border-indigo-500 focus:bg-white focus:outline-none transition" /></div>
                    </DashboardCard>
                    <DashboardCard title="Tools & Utilities">
                        <p className="text-sm text-slate-500 mb-4">Manage your time credits and interactions.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><ToolButton icon={<ClockIcon />} label="Time Calculator" /><ToolButton icon={<CalendarIcon />} label="Community Calendar" /><ToolButton icon={<ListIcon />} label="Transaction History" /></div>
                    </DashboardCard>
                </div>
            </main>
            
            <AddOfferModal isOpen={isAddOfferModalOpen} onClose={() => setIsAddOfferModalOpen(false)} initialData={payItForwardData} />
            {features.showWelcomeRitual && <WelcomeModal isOpen={showWelcome} onClose={() => setShowWelcome(false)} user={userData} />}
            {features.enableKudosSystem && <KudosModal item={showKudos} onClose={() => setShowKudos(null)} onPayItForward={handlePayItForward} />}
            {features.showCommunityFund && <CommunityFundModal isOpen={isFundModalOpen} onClose={() => setIsFundModalOpen(false)} />}
            {features.enableRequestAmplification && <AmplifyModal item={isAmplifyModalOpen} onClose={() => setIsAmplifyModalOpen(null)} />}
        </div>
    );
}

