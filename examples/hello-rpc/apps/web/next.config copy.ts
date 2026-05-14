import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        // Enable authentication interrupts for forbidden() and unauthorized()
        authInterrupts: true,
    },
    // Enable component-level caching
    cacheComponents: true,
    cacheLife: {
        // Define custom cache profiles
        default: {
            stale: 300, // 5 minutes
            revalidate: 900, // 15 minutes
            expire: 3600, // 1 hour
        },
    },
};

export default nextConfig;
