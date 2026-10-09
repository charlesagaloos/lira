
import React, { useEffect, useState } from 'react';

import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import ChromeSparkles from './ChromeSparkles';
import FlashAlert from '../UI/FlashAlert';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const ADMIN_SIDEBAR_STORAGE_KEY = 'lira-admin-sidebar-collapsed';

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    useEffect(() => {
        setSidebarCollapsed(
            localStorage.getItem(ADMIN_SIDEBAR_STORAGE_KEY) === 'true',
        );
    }, []);

    function toggleSidebar() {
        setSidebarCollapsed((current) => {
            const next = !current;

            localStorage.setItem(
                ADMIN_SIDEBAR_STORAGE_KEY,
                String(next),
            );

            return next;
        });
    }

    return (
        <main className="min-h-screen bg-[#050607] text-white">
            <div className="min-h-screen">
                <AdminSidebar
                    collapsed={sidebarCollapsed}
                    onToggle={toggleSidebar}
                />

                <section
                    className={`relative min-w-0 transition-[margin] duration-300 ${
                        sidebarCollapsed
                            ? 'lg:ml-[76px]'
                            : 'lg:ml-[250px]'
                    }`}
                >
                    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
                        <div className="absolute inset-0 bg-[#050607]" />

                        <div className="absolute inset-0 bg-[linear-gradient(135deg,#050607_0%,#080a0c_45%,#050607_100%)]" />

                        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)]" />

                        <ChromeSparkles />
                    </div>

                    <div className="relative z-30">
                        <AdminHeader
                            sidebarCollapsed={sidebarCollapsed}
                        />
                    </div>

                    <div className="relative z-10 min-h-screen pt-[68px] lg:pt-[76px]">
                        {children}
                    </div>

                    <FlashAlert />
                </section>
            </div>
        </main>
    );
}
