import { defineVitestConfig } from '@ice/pkg';
// import react from '@vitejs/plugin-react';

export default defineVitestConfig(() => ({
  // plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.ts'],
  },
}));
