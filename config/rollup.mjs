import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import url from '@rollup/plugin-url';
import cssnano from 'cssnano';
import terser from '@rollup/plugin-terser';

// Dev plugins
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const isDev = process.env.ROLLUP_WATCH === 'true';

export default {
  input: 'src/index-build.js',
  output: {
    name: 'waybackDiff',
    file: 'build/app.js',
    format: 'es',
    sourcemap: true
  },
  plugins: [
    resolve({
      browser: true
    }),
    commonjs({
      include: 'node_modules/**',
      exclude: 'node_modules/process-es6/**'
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(isDev ? 'development' : 'production'),
      preventAssignment: true
    }),
    url(),
    postcss({
      extensions: ['.css'],
      plugins: [cssnano()]
    }),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
      presets: ['@babel/preset-env', '@babel/preset-react'],
      plugins: ['@babel/plugin-proposal-export-default-from']
    }),
    !isDev && terser(), // only minify in production
    isDev && serve({
      open: true,
      contentBase: ['build', 'public'],
      host: '0.0.0.0',
      port: 5000
    }),
    isDev && livereload({ watch: 'build' })
  ].filter(Boolean)
};
