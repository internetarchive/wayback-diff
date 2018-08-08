// Rollup plugins.
import babel from 'rollup-plugin-babel';
import cjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import postcss from 'rollup-plugin-postcss';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
require('dotenv').load();

import cssnano from 'cssnano';

export default {
  input: 'src/index.js',
  output: {
    name: 'waybackDiff',
    file: 'build/app.js',
    format: 'es',
    sourcemap: true
  },
  plugins: [
    postcss({
      extensions: [ '.css' ]
    }),
    cssnano(),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [ [ 'es2015', { modules: false } ], 'stage-0', 'react' ],
      plugins: [ 'external-helpers' ]
    }),
    cjs({
      exclude: 'node_modules/process-es6/**',
      include: [
        'node_modules/**'
      ]
    }),
    globals(),
    replace({ 'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env': JSON.stringify(process.env),
      'process.env.REACT_APP_WEB_MONITORING_PROCESSING_URL': JSON.stringify(process.env.REACT_APP_WEB_MONITORING_PROCESSING_URL),
      'process.env.REACT_APP_WEB_MONITORING_PROCESSING_PORT': JSON.stringify(process.env.REACT_APP_WEB_MONITORING_PROCESSING_PORT)}),
    resolve({
      browser: true,
      main: true
    })
  ]
};
