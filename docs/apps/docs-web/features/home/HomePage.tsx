'use client';

import { useState, useEffect } from 'react';
import { AnimatedBackground } from './components/AnimatedBackground';
import { HeroSection } from './components/HeroSection';
import { StatsSection } from './components/StatsSection';
import { FeaturesSection } from './components/FeaturesSection';
import { CodeComparisonSection } from './components/CodeComparisonSection';
import { FeatureShowcaseSection } from './components/FeatureShowcaseSection';
import { TechStackSection } from './components/TechStackSection';
import { UseCasesSection } from './components/UseCasesSection';
import { FAQSection } from './components/FAQSection';
import { CTASection } from './components/CTASection';

export function HomePage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="relative min-h-screen bg-black text-white overflow-hidden">
            <AnimatedBackground />
            <HeroSection mounted={mounted} />
            <StatsSection />
            <FeaturesSection />
            <CodeComparisonSection />
            <FeatureShowcaseSection />
            <TechStackSection />
            <UseCasesSection />
            <FAQSection />
            <CTASection />
        </div>
    );
}