import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    /* config options here */
    turbopack: {
        rules: {
            '*.svg': {
                loaders: ['@svgr/webpack'],
                as: '*.js',
            },
        },
    },
    // Add webpack fallback for better compatibility
    webpack: (config: any) => {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
            net: false,
            tls: false,
        }
        return config
    },
}

export default nextConfig
