//** @type {import('next').NextConfig} */
//const nextConfig = {
//    reactStrictMode: false,
//    images: { unoptimized: true }
//};
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

// Solo activamos la plataforma de Cloudflare en entorno de desarrollo local
if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... aquí mantienes cualquier otra configuración que ya tuviera el archivo
};

export default nextConfig;
