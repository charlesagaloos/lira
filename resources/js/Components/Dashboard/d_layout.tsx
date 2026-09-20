import React from 'react';

import Sidebar from './Sidebar';
import DashboardHeader from './Header';
import ChromeSparkles from './ChromeSparkles';
import FlashAlert from '../UI/FlashAlert';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    return (
        <main className="min-h-screen bg-[#050607] text-white">

            {/* =============================================================
                APPLICATION SHELL
            ============================================================= */}

            <div className="flex min-h-screen">

                {/* =========================================================
                    SIDEBAR

                    IMPORTANT:
                    z-40 keeps the sidebar above the fixed background.
                ========================================================== */}

                <div className="relative z-40 shrink-0">
                    <Sidebar />
                </div>

                {/* =========================================================
                    MAIN AREA
                ========================================================== */}

                <section className="relative min-w-0 flex-1">

                    {/* =====================================================
                        FIXED VISUAL BACKGROUND

                        This stays fixed to the viewport so the sparkle
                        positions do not change when switching pages.
                    ====================================================== */}

                    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

                        {/* Base background */}
                        <div className="absolute inset-0 bg-[#050607]" />

                        {/* Subtle chrome atmosphere */}
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,#050607_0%,#080a0c_45%,#050607_100%)]" />

                        {/* Top chrome reflection */}
                        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)]" />

                        {/* Stable sparkle field */}
                        <ChromeSparkles />
                    </div>

                    {/* =====================================================
                        HEADER

                        Keep header above the background.
                    ====================================================== */}

                    <div className="relative z-30">
                        <DashboardHeader />
                    </div>

                    {/* =====================================================
                        PAGE STAGE
                    ====================================================== */}

                    <div className="relative z-10 min-h-screen pt-[76px]">
                        {children}
                    </div>

                    <FlashAlert />

                </section>
            </div>
        </main>
    );
}
