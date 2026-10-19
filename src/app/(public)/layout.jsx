import React from "react";
import SiteNavbar from "./_components/SiteNavbar";
import FooterSection from "./_components/FooterSection";
import ImagePackSelector from "./_components/ImagePackSelector";
import CartDrawer from "./_components/CartDrawer";
import { CrystalAuraProviders } from "./_context/CrystalAuraProviders";
import { getStoreInfo } from "@/lib/devlomatix-store";

// Import local premium stylesheet overrides
import "./_styles/crystals.css";

export const metadata = {
    title: 'Crystal Aura | Sacred Gemstones & Healing Crystals',
    description: 'Discover our curated collection of authentic healing crystals, gemstones, and spiritual tools. Expertly sourced for your spiritual journey.',
};

export default async function CrystalAuraLayout({ children }) {
    const storeInfo = await getStoreInfo();
    const storeLogo = storeInfo?.store?.logo || null;
    const storeName = storeInfo?.store?.name || "CrystalAura";

    return (
        <CrystalAuraProviders>
            <div className="relative min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
                {/* Subtle ambient background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none -z-20">
                    <div className="absolute top-[5%] left-[5%] w-[40vw] h-[40vw] rounded-full blur-[150px] orb-glow-primary opacity-30" />
                    <div className="absolute bottom-[5%] right-[5%] w-[35vw] h-[35vw] rounded-full blur-[150px] orb-glow-accent opacity-25" />
                </div>

                {/* 🧭 Site Navbar Header */}
                <SiteNavbar initialLogo={storeLogo} initialStoreName={storeName} />

                {/* 🛒 Cart Drawer */}
                <CartDrawer />

                {/* 🌌 Main Body Contents */}
                <main className="flex-grow">
                    {children}
                </main>

                {/* 🧭 Site Footer Section */}
                <FooterSection />

                {/* 🎨 Dynamic Image Pack Selector */}
                <ImagePackSelector />
            </div>
        </CrystalAuraProviders>
    );
}
