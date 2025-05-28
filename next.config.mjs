/** @type {import('next').NextConfig} */
const nextConfig = {

    eslint: {
      // Prevent build failures on Vercel due to ESLint engine option mismatches.
      // Run `npm run lint` locally/CI to enforce linting.
      ignoreDuringBuilds: true,
    },

    images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "randomuser.me",
          },
        ],
      },

};

export default nextConfig;
