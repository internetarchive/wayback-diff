// Rollup plugins.
import babel from 'rollup-plugin-babel';
import cjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import postcss from 'rollup-plugin-postcss';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import url from 'rollup-plugin-url';

import cssnano from 'cssnano';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.js',
  output: {
    name: 'waybackDiff',
    file: 'build/app.js',
    format: 'es',
    sourcemap: true
  },
  plugins: [
    terser(),
    url(),
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
    replace({ 'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env': JSON.stringify(process.env)}),
    resolve({
      browser: true,
      main: true
    }),
    cjs({
      exclude: 'node_modules/process-es6/**',
      include: [
        'node_modules/**'
      ],
      namedExports: {
        'node_modules/react/index.js': ['PureComponent', 'Component'],
        'node_modules/simple-xpath-position/index.js': ['fromNode']
      }
    }),
    globals()
  ]
};
