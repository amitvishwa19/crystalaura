'use client';

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart, useWishlist, useTheme } from "../_context/CrystalAuraProviders";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { shopMenuGroups, SHOP_CATEGORIES } from "../_data/shopCategories";
import { AppLogo } from "@/components/global/AppLogo";

// Inline SVG Icon components to completely bypass Next.js Turbopack lucide-react caching bugs
const CartIcon = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
);

const MenuIcon = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
);

const XIcon = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
);

const HeartIcon = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
);

const SunIcon = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>
);

const MoonIcon = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
);

const GlobeIcon = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
);

const UserIcon = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);

const shopLinks = SHOP_CATEGORIES.map((category) => ({
    label: category.label,
    path: `/shop?category=${category.slug}`,
}));

const navItems = [
    { label: "Home", path: "/" },
    { label: "Shop", submenu: shopLinks },
    {
        label: "Discover",
        submenu: [
            { label: "Crystal Guide", path: "/crystals" },
            { label: "Vastu Stones", path: "/vastu" },
        ]
    },
    {
        label: "Resources",
        submenu: [
            { label: "Blog", path: "/blog" },
            { label: "FAQ", path: "/faq" },
        ]
    },
    {
        label: "About Us",
        submenu: [
            { label: "Our Story", path: "/about" },
            { label: "Contact", path: "/contact" },
        ]
    },
];

const simpleNavItems = [
    { label: "Discover", links: [
        { label: "Crystal Guide", path: "/crystals", description: "Meanings & healing properties" },
        { label: "Vastu Stones", path: "/vastu", description: "Harmonize your space" },
    ]},
    { label: "Resources", links: [
        { label: "Blog", path: "/blog", description: "Guides, rituals & insights" },
        { label: "FAQ", path: "/faq", description: "Answers to common questions" },
    ]},
    { label: "About Us", links: [
        { label: "Our Story", path: "/about", description: "Our mission & values" },
        { label: "Contact", path: "/contact", description: "Get in touch with us" },
    ]},
];

const navLinkClass = (active) =>
    `flex items-center h-10 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
        active ? "text-primary bg-primary/10 font-black" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
    }`;

const navTriggerClass = (active) =>
    `h-10 px-4 py-2.5 rounded-lg bg-transparent text-sm font-semibold transition-all duration-300 hover:bg-muted/50 hover:text-foreground focus:bg-muted/50 focus:text-foreground data-[state=open]:bg-muted/50 data-[state=open]:text-primary ${
        active ? "text-primary font-black" : "text-muted-foreground"
    }`;

const SiteNavbar = ({ initialLogo, initialStoreName }) => {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { totalItems, setIsOpen } = useCart();
    const { items: wishlistItems } = useWishlist();
    const { theme, toggleTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                ? "glass border-b border-border/50 shadow-lg shadow-primary/5 py-2.5"
                : "bg-transparent border-b border-transparent py-5"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <AppLogo
                    link="/"
                    className="h-9 md:h-11 w-auto max-w-[210px]"
                    height={44}
                    width={185}
                    priority
                    initialLogo={initialLogo}
                    initialStoreName={initialStoreName}
                />

                {/* Desktop Navigation */}
                <NavigationMenu className="hidden md:flex flex-none">
                    <NavigationMenuList className="gap-1.5">
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link href="/" className={navLinkClass(pathname === "/")}>
                                    Home
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        {/* Shop Mega Menu */}
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className={navTriggerClass(pathname === "/shop")}>
                                Shop
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <div className="w-[calc(100vw-3rem)] max-w-[760px] p-6">
                                    <div className="grid grid-cols-4 gap-6">
                                        <div className="col-span-3">
                                            <p className="mb-3 px-3 text-sm font-black uppercase tracking-[0.2em] text-primary">
                                                Shop by Type
                                            </p>
                                            <ul className="grid grid-cols-3 gap-1">
                                                {shopMenuGroups[0].items.map((item) => (
                                                    <li key={item.slug}>
                                                        <NavigationMenuLink asChild>
                                                            <Link
                                                                href={`/shop?category=${item.slug}`}
                                                                className="block rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-muted/50"
                                                            >
                                                                <span className="block text-sm font-semibold text-foreground">
                                                                    {item.label}
                                                                </span>
                                                                <span className="block text-sm leading-snug text-muted-foreground">
                                                                    {item.description}
                                                                </span>
                                                            </Link>
                                                        </NavigationMenuLink>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="col-span-1 border-l border-border/50 pl-6">
                                            <p className="mb-3 px-3 text-sm font-black uppercase tracking-[0.2em] text-primary">
                                                Collections
                                            </p>
                                            <ul className="flex flex-col gap-1">
                                                {shopMenuGroups[1].items.map((item) => (
                                                    <li key={item.slug}>
                                                        <NavigationMenuLink asChild>
                                                            <Link
                                                                href={`/shop?category=${item.slug}`}
                                                                className="block rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-muted/50"
                                                            >
                                                                <span className="block text-sm font-semibold text-foreground">
                                                                    {item.label}
                                                                </span>
                                                                <span className="block text-sm leading-snug text-muted-foreground">
                                                                    {item.description}
                                                                </span>
                                                            </Link>
                                                        </NavigationMenuLink>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        {/* Discover / Resources / About */}
                        {simpleNavItems.map((section) => {
                            const isActive = section.links.some((link) => link.path === pathname);
                            return (
                                <NavigationMenuItem key={section.label}>
                                    <NavigationMenuTrigger className={navTriggerClass(isActive)}>
                                        {section.label}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="flex w-64 flex-col gap-1 p-2.5">
                                            {section.links.map((link) => (
                                                <li key={link.path}>
                                                    <NavigationMenuLink asChild>
                                                        <Link
                                                            href={link.path}
                                                            className="block rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-muted/50"
                                                        >
                                                            <span className="block text-sm font-semibold text-foreground">
                                                                {link.label}
                                                            </span>
                                                            <span className="block text-sm leading-snug text-muted-foreground">
                                                                {link.description}
                                                            </span>
                                                        </Link>
                                                    </NavigationMenuLink>
                                                </li>
                                            ))}
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            );
                        })}
                    </NavigationMenuList>
                </NavigationMenu>

                {/* Right Side Icons */}
                <div className="flex items-center gap-2">
                    {/* Currency Indicator */}
                    <button className="text-muted-foreground hover:text-foreground transition-all flex items-center gap-1.5 text-sm font-sans font-black px-3 py-2 rounded-xl border border-border/50 bg-background/50 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 active:scale-95">
                        <GlobeIcon className="w-3.5 h-3.5 text-primary" />
                        <span>INR</span>
                    </button>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-xl bg-background/50 text-foreground hover:bg-primary/10 hover:text-primary border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 active:scale-95"
                        aria-label="Toggle theme"
                    >
                        {!mounted ? (
                            <span className="block w-4.5 h-4.5" />
                        ) : theme === "dark" ? <SunIcon className="w-4.5 h-4.5" /> : <MoonIcon className="w-4.5 h-4.5" />}
                    </button>

                    {/* Wishlist */}
                    <Link
                        href="/wishlist"
                        className="relative p-2.5 rounded-xl bg-background/50 text-foreground hover:bg-primary/10 hover:text-primary border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 active:scale-95"
                        aria-label="Wishlist"
                    >
                        <HeartIcon className="w-4.5 h-4.5" />
                        {wishlistItems?.length > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-destructive text-white text-sm font-black rounded-full flex items-center justify-center shadow-md">
                                {wishlistItems.length}
                            </span>
                        )}
                    </Link>

                    {/* Cart */}
                    <button
                        onClick={() => setIsOpen(true)}
                        className="relative p-2.5 rounded-xl bg-background/50 text-foreground hover:bg-primary/10 hover:text-primary border border-border/50 hover:border-primary/20 transition-all duration-300 group hover:shadow-lg hover:shadow-primary/5 active:scale-95"
                        aria-label="Open cart"
                    >
                        <CartIcon className="w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-110" />
                        {totalItems > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-gold-gradient text-white text-sm font-black rounded-full flex items-center justify-center shadow-lg"
                            >
                                {totalItems}
                            </motion.span>
                        )}
                    </button>

                    {/* Account */}
                    <Link
                        href="/account"
                        className="relative p-2.5 rounded-xl bg-background/50 text-foreground hover:bg-primary/10 hover:text-primary border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 active:scale-95"
                        aria-label="Account"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2.5 rounded-xl bg-background/50 text-foreground hover:bg-primary/10 border border-border/50 transition-all duration-300"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <XIcon className="w-4.5 h-4.5" /> : <MenuIcon className="w-4.5 h-4.5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden bg-popover/95 backdrop-blur-xl border-b border-border/50 overflow-hidden"
                    >

                        <ul className="flex flex-col gap-1.5 px-6 py-5 text-sm font-bold">
                            {navItems.map((item) => {
                                if (item.submenu) {
                                    return (
                                        <li key={item.label} className="py-2">
                                            <span className="block px-4 py-1 text-sm text-muted-foreground/60 font-black">
                                                {item.label}
                                            </span>
                                            <ul className="flex flex-col gap-1.5 mt-1.5 pl-4 border-l border-border/50">
                                                {item.submenu.map((subItem) => (
                                                    <li key={subItem.path}>
                                                        <Link
                                                            href={subItem.path}
                                                            className={`block py-2.5 px-4 rounded-lg transition-all duration-300 ${pathname === subItem.path
                                                                    ? "text-primary bg-primary/10 font-black"
                                                                    : "text-muted-foreground hover:text-foreground"
                                                                }`}
                                                        >
                                                            {subItem.label}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    );
                                }

                                return (
                                    <li key={item.path}>
                                        <Link
                                            href={item.path}
                                            className={`block py-3 px-4 rounded-lg transition-all duration-300 ${pathname === item.path
                                                    ? "text-primary bg-primary/10 font-black"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                                }`}
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default SiteNavbar;
