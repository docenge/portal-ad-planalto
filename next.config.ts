import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: { '/api/biblia/download': ['./downloads/biblia-ad-planalto.zip'] },
};

export default nextConfig;
