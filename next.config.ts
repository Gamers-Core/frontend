import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.*'],
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
