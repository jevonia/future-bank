'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSupabase } from './supabase-provider';

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
import { LoginModal } from '../components/modals/LoginModal';
import { ClockIcon, CalendarIcon, ListIcon, SearchIcon } from '../components/icons';

// Import mock data for features that are not yet dynamic
import { communityPulseData, contributionData, communityProjects, communityFundData, features } from '../lib/data';

export default function Dashboard() {
    const { session, supabase } = useSupabase();

    // State for live data
    const [profile, setProfile] = useState<any>(null);
    const [offers, setOffers] = useState<any[]>([]);
    const [wants, setWants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // State for modals
    const [isAddOfferModalOpen, setIsAddOfferModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [showKudos, setShowKudos] = useState<any>(null);
    const [payItForwardData, setPayItForwardData] = useState<any>(null);
    const [isFundModalOpen, setIsFundModalOpen] = useState(false);
    const [isAmplifyModalOpen, setIsAmplifyModalOpen] = useState<any>(null);
    const [showWelcome, setShowWelcome] = useState(features.showWelcomeRitual);


    const getProfileAndData = useCallback(async () => {
        if (session) {
            setLoading(true);
            let { data: profileData, error: profileError } = await supabase.from('profiles').select(`username, time_balance`).eq('id', session.user.id).single();
            if (profileError) console.error('Error fetching profile:', profileError.message);
            else setProfile(profileData);

            let { data: offersData, error: offersError } = await supabase.from('offers').select('*').eq('user_id', session.user.id);
            if (offersError) console.error('Error fetching offers:', offersError.message);
            else setOffers(offersData || []);

            let { data: wantsData, error: wantsError } = await supabase.from('wants').select('*').eq('user_id', session.user.id);
            if (wantsError) console.error('Error fetching wants:', wantsError.message);
            else setWants(wantsData || []);

            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [session, supabase]);

    useEffect(() => {
        getProfileAndData();
    }, [session, getProfileAndData]);

const handleOfferAdded = () => {
    console.log('handleOfferAdded called'); // Add this for debugging
    getProfileAndData();
    setIsAddOfferModalOpen(false); // This should close the modal
};
    const handleCompleteExchange = (item: any) => {
        if (features.enableKudosSystem) setShowKudos(item);
    };

    const handlePayItForward = (item: any) => {
        const prefill = { title: `Offering beginner ${item.title.split(' Lessons')[0]} tips`, description: `Inspired by a great community exchange, I'd like to share what I've learned about ${item.title.toLowerCase()}!` };
        setPayItForwardData(prefill);
        setShowKudos(null);
        setIsAddOfferModalOpen(true);
    };

    useEffect(() => {
        if (session) {
            setIsLoginModalOpen(false);
        }
    }, [session]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <Header 
                onSignInClick={() => setIsLoginModalOpen(true)} 
                profile={profile} 
            />
            <main className="p-4 sm:p-6 md:p-8">
                {loading && session ? (
                    <p className="text-center">Loading your dashboard...</p>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                        {features.showCommunityPulse && <CommunityPulse data={communityPulseData} />}
                        {features.showGroupProjects && <CommunityProjects projects={communityProjects} />}
                        {features.showCommunityFund && <CommunityFund data={communityFundData} onInteract={() => session ? setIsFundModalOpen(true) : setIsLoginModalOpen(true)} />}
                        
                        {session && (
                            <>
                                <DashboardCard title="My Offers" onAdd={() => { setPayItForwardData(null); setIsAddOfferModalOpen(true); }}>
                                    <div className="space-y-4">{offers.map(offer => <ServiceCard key={offer.id} item={offer} type="offer" />)}</div>
                                </DashboardCard>
                                <DashboardCard title="My Wants">
                                    <div className="space-y-4">{wants.map(want => <ServiceCard key={want.id} item={want} type="want" onComplete={handleCompleteExchange} onAmplify={() => setIsAmplifyModalOpen(want)} />)}</div>
                                </DashboardCard>
                                {features.showContributionConstellation && <ContributionConstellation data={contributionData} />}
                            </>
                        )}

                        <DashboardCard title="Community Marketplace">
                            <p className="text-sm text-slate-500 mb-4">Discover skills and services offered by others.</p>
                            <div className="relative mb-4"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><SearchIcon /></div><input type="text" placeholder="Search for services..." className="w-full p-3 pl-12 bg-slate-100 rounded-lg border-2 border-transparent focus:border-indigo-500 focus:bg-white focus:outline-none transition" /></div>
                        </DashboardCard>
                    </div>
                )}
            </main>
            
            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
            <AddOfferModal 
                isOpen={isAddOfferModalOpen} 
                onClose={() => setIsAddOfferModalOpen(false)} 
                onOfferAdded={handleOfferAdded} 
                initialData={payItForwardData} 
            />
            <KudosModal item={showKudos} onClose={() => setShowKudos(null)} onPayItForward={handlePayItForward} />
            <CommunityFundModal isOpen={isFundModalOpen} onClose={() => setIsFundModalOpen(false)} />
            <AmplifyModal item={isAmplifyModalOpen} onClose={() => setIsAmplifyModalOpen(null)} />
        </div>
    );
}