import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendTarget = env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';
  // TODO: Update NEXT_PUBLIC_SITE_URL / VITE_SITE_URL when custom domain (e.g. bis-ai.gov.in) is active.

  return {
    plugins: [react()],
    define: {
      __BUILD_DATE__: JSON.stringify(new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }))
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true,
          secure: false
        }
      }
    }
  };
});
