import { defineConfig } from '@ice/app';

// The project config, see https://v3.ice.work/docs/guide/basic/config
const minify = process.env.NODE_ENV === 'production' ? 'swc' : false;
export default defineConfig(() => ({
  // Set your configs here.
  minify,
  server: {
    // onDemand: true,
    format: 'esm',
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.conditionNames = ['es2017', '...'];
    return webpackConfig;
  },
}));
