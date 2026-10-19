'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function AppLogo({
    size = 130,
    height = 44,
    width = 180,
    link = '/',
    className,
    priority = false,
    initialLogo = null,
    initialStoreName = 'CrystalAura',
}) {
    const [storeLogo, setStoreLogo] = useState(() => {
        if (initialLogo) return initialLogo;
        if (typeof window !== 'undefined') {
            return localStorage.getItem('crystal-aura-store-logo') || null;
        }
        return null;
    });

    const [storeName, setStoreName] = useState(() => {
        if (initialStoreName) return initialStoreName;
        if (typeof window !== 'undefined') {
            return localStorage.getItem('crystal-aura-store-name') || 'CrystalAura';
        }
        return 'CrystalAura';
    });

    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        if (initialLogo) {
            setStoreLogo(initialLogo);
            setImgError(false);
        }
    }, [initialLogo]);

    useEffect(() => {
        if (initialStoreName) {
            setStoreName(initialStoreName);
        }
    }, [initialStoreName]);

    useEffect(() => {
        let isMounted = true;

        fetch('/api/store/store')
            .then((res) => res.json())
            .then((data) => {
                if (isMounted && data?.success && data?.store) {
                    if (data.store.logo) {
                        setStoreLogo(data.store.logo);
                        localStorage.setItem('crystal-aura-store-logo', data.store.logo);
                    } else {
                        setStoreLogo(null);
                        localStorage.removeItem('crystal-aura-store-logo');
                    }
                    if (data.store.name) {
                        setStoreName(data.store.name);
                        localStorage.setItem('crystal-aura-store-name', data.store.name);
                    }
                }
            })
            .catch((err) => {
                console.warn('[STORE_LOGO_FETCH_ERROR]', err);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const logoContent = (
        <div
            className={cn(
                'transition-all duration-300 ease-in-out flex items-center justify-center relative overflow-hidden',
                className
            )}
        >
            {storeLogo && !imgError ? (
                <Image
                    src={storeLogo}
                    alt={storeName || 'CrystalAura'}
                    width={width}
                    height={height}
                    className="object-contain max-h-full w-auto transition-transform duration-300 group-hover:scale-105"
                    priority={priority}
                    unoptimized
                    onError={() => setImgError(true)}
                />
            ) : (
                <span className="font-serif text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                    {storeName || 'CrystalAura'}
                </span>
            )}
        </div>
    );

    if (link) {
        return (
            <Link href={link} className="inline-flex items-center group">
                {logoContent}
            </Link>
        );
    }

    return logoContent;
}

export default AppLogo;
