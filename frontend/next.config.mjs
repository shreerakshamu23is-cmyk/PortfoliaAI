/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: fontMode(),
  swcMinify: true,
};

function fontMode() {
  return true;
}

export default nextConfig;
