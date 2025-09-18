import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      'process.env': {
        VITE_RAZORPAY_KEY_ID: JSON.stringify(env.VITE_RAZORPAY_KEY_ID || 'rzp_test_RCgu6FC0Ytdgk6'),
        VITE_RAZORPAY_KEY_SECRET: JSON.stringify(env.VITE_RAZORPAY_KEY_SECRET || 'm2QGMK3rQdvO6p38q1qAfoeU')
      }
    },
    resolve: {
      alias: {
        '@': '/src'
      },
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});
