import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        // Gunakan resolvePageComponent bawaan Laravel Vite Plugin
        // Ini lebih aman untuk menangani path dan subfolder
        return resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx')
        ).then((page) => {
            // Jika file tidak ditemukan (null), Inertia akan memunculkan error 'component'
            // Kita beri proteksi tambahan di sini
            if (!page) {
                console.error(`Komponen ${name} tidak ditemukan.`);
            }
            return page;
        });
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});