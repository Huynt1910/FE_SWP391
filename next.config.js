/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    // Enables the styled-components SWC transform if you're using styled-components
    styledComponents: true,
  },
  images: {
    domains: ["res.cloudinary.com"], // Thêm hostname của hình ảnh
  },
};

module.exports = nextConfig;
