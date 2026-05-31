import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'prompt',
            includeAssets: ['icons/*.svg'],
            workbox: {
                globPatterns: ['**/*.{js,css,html,json,png,svg,woff,woff2}'],
                navigateFallback: 'index.html',
                runtimeCaching: [],
            },
            manifest: false,
        }),
    ],
});
