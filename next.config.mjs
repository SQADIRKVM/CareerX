import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        return config;
    },
    transpilePackages: ['@ai-sdk/ui-utils', 'zod-to-json-schema', 'ai'],
};

export default nextConfig;
