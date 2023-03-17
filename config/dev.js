// Rollup plugins.
import { babel } from '@rollup/plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import postcss from 'rollup-plugin-postcss';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import url from 'rollup-plugin-url';

import cssnano from 'cssnano';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index-build.js',
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
      presets: [ '@babel/env', '@babel/preset-react' ],
      plugins: [ '@babel/plugin-proposal-export-default-from' ]
    }),
    replace({ 'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env': JSON.stringify(process.env)}),
    resolve({
      browser: true,
      main: true
    }),
    commonjs({
      include: [
        'node_modules/**'
      ],
      exclude: 'node_modules/process-es6/**',
      namedExports: {
        'node_modules/react/index.js': ['PureComponent', 'Component'],
        'node_modules/simple-xpath-position/index.js': ['fromNode'],
        'node_modules/react-is/index.js': ['isValidElementType']
      }
    }),
    globals()
  ]
};
