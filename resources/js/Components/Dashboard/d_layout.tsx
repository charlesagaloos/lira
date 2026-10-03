import React, { useEffect, useState } from 'react';

import Sidebar from './Sidebar';
import DashboardHeader from './Header';
import ChromeSparkles from './ChromeSparkles';
import FlashAlert from '../UI/FlashAlert';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const SIDEBAR_STORAGE_KEY = 'lira-sidebar-collapsed';

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    useEffect(() => {
        const savedState =
            localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true';

        setSidebarCollapsed(savedState);
    }, []);

    function toggleSidebar() {
        setSidebarCollapsed((current) => {
            const next = !current;

            localStorage.setItem(
                SIDEBAR_STORAGE_KEY,
                String(next),
            );

            return next;
        });
    }

    return (
        <main className="min-h-screen bg-[#050607] text-white">

            {/* =============================================================
                APPLICATION SHELL
            ============================================================= */}

            <div className="min-h-screen">

                {/* =========================================================
                    SIDEBAR

                    Desktop only. Mobile/tablet navigation is handled
                    by the responsive header.
                ========================================================== */}

                <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />

                {/* =========================================================
                    MAIN AREA

                    The left margin follows the sidebar state.

                    Expanded:
                    250px

                    Collapsed:
                    76px

                    Mobile / tablet:
                    0px
                ========================================================== */}

                <section className={`relative min-w-0 transition-[margin] duration-300 ${sidebarCollapsed ? 'lg:ml-[76px]' : 'lg:ml-[250px]'}`}>

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


                    <div className="relative z-30">
                        <DashboardHeader sidebarCollapsed={sidebarCollapsed} />
                    </div>

                    {/* =====================================================
                        PAGE STAGE
                    ====================================================== */}

                    <div className="relative z-10 min-h-screen pt-[76px]">
                        {children}
                    </div>

                    {/* =====================================================
                        GLOBAL FLASH ALERT
                    ====================================================== */}

                    <FlashAlert />

                </section>
            </div>
        </main>
    );
}
