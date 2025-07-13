export const features = {
    showWelcomeRitual: true,
    showCommunityPulse: true,
    showContributionConstellation: true,
    enableKudosSystem: true,
    enablePayItForward: true,
    showGroupProjects: true,
    showCommunityFund: true,
    enableRequestAmplification: true,
};

export const userData = { name: "Nova", balance: 17.5, avatarUrl: 'https://placehold.co/100x100/A78BFA/FFFFFF?text=N' };
export const userOffers = [
    { id: 1, title: "Graphic Design for Social Media", description: "Creating banners and posts for community projects.", value: "1.5 TC/hr", category: "Creative" },
    { id: 2, title: "Beginner JavaScript Tutoring", description: "Helping newcomers understand the basics of JS and React.", value: "1.0 TC/hr", category: "Tech" },
    { id: 3, title: "Urban Gardening Consultation", description: "Advising on small-space and container gardening setups.", value: "1.2 TC/hr", category: "Lifestyle" },
];
export const userWants = [
    { id: 1, title: "Help with Bike Repair", description: "My bike's chain keeps slipping and I need help fixing it.", category: "Repair", value: 2.0 },
    { id: 2, title: "Sourdough Baking Lessons", description: "Looking for someone to teach me the art of making sourdough bread.", category: "Skills", value: 3.0 },
    { id: 3, title: "Someone to Practice Spanish With", description: "Intermediate speaker looking for a conversation partner.", category: "Language", value: 1.0 },
];
export const communityPulseData = { exchangesThisWeek: 23, newMembers: 4, activeProjects: 7 };
export const contributionData = [ { type: 'Creative', count: 5 }, { type: 'Tech', count: 8 }, { type: 'Lifestyle', count: 3 }, { type: 'Repair', count: 2 }, { type: 'Skills', count: 4 } ];
export const kudosOptions = ["Great Teacher", "Patient Listener", "Creative Problem-Solver", "Reliable & Punctual", "Generous Spirit"];
export const communityProjects = [
    { id: 1, title: "Community Garden Weeding Day", description: "Help us clear out the weeds at the community garden plot.", goal: 10, current: 7.5, category: "Lifestyle", participants: ['A', 'B', 'C'] },
    { id: 2, title: "Translate App Welcome Guide", description: "Help translate our welcome guide into Spanish and Vietnamese.", goal: 8, current: 2, category: "Language", participants: ['D'] },
];
export const communityFundData = { balance: 127.5 };
