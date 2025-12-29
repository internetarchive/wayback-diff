import fs from 'fs';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
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
  input: isDev ? 'src/index.js' : 'src/index-build.js',
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
    json(),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
      presets: ['@babel/preset-env', '@babel/preset-react'],
      plugins: ['@babel/plugin-proposal-export-default-from']
    }),
    terser(),
    isDev && serve({
      open: true,
      contentBase: ['build', 'public'],
      host: '0.0.0.0',
      port: 5000,
      historyApiFallback: true,
      //
      // To enable https you need:
      // mkdir cert
      // openssl req -x509 -newkey rsa:4096 -nodes -keyout cert/key.pem -out cert/cert.pem -days 36
      //
      // https: {
      //   key: fs.readFileSync('cert/key.pem'),
      //   cert: fs.readFileSync('cert/cert.pem')
      // }
    }),
    isDev && livereload({ watch: 'build' })
  ].filter(Boolean)
};
