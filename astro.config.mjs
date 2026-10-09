import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({ site: 'https://zuluniner.com', output: 'static', integrations: [react()], vite: { plugins: [tailwindcss()], resolve: { alias: { '@': new URL('./src', import.meta.url).pathname } } } });
