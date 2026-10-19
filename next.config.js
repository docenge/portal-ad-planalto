/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingIncludes: { '/api/biblia/download': ['./downloads/biblia-ad-planalto.zip'] },
}
module.exports = nextConfig
