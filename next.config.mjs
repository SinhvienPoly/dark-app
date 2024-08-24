/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost', process.env.NEXT_REDIRECT_URL],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '1gb',
        },
    },
};

export default nextConfig;
