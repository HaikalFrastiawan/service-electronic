/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Membolehkan build selesai meskipun ada error ESLint
        ignoreDuringBuilds: true,
    },
    typescript: {
        // Membolehkan build selesai meskipun ada error Tipe TypeScript
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },
};

module.exports = nextConfig;