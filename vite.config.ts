import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => {
  return {
    plugins: [qwikCity(), qwikVite({
      entryStrategy: { 
        type: 'smart', 
        manual: {
          'KnNE9eL0qfc': 'bench', 
          '0gb0985QWS0': 'bench',
          'Pm0uc2lpZTc': 'bench',
        }
      }
    }), tsconfigPaths()],
    preview: {
      headers: {
        'Cache-Control': 'public, max-age=600',
      },
    },
  };
});
