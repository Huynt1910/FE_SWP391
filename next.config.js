/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    // Enables the styled-components SWC transform if you're using styled-components
    styledComponents: true,
  },
};

module.exports = nextConfig;
