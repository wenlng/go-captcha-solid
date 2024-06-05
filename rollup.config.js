import withSolid from "rollup-preset-solid";
import { terser } from 'rollup-plugin-terser';
const postcss = require('rollup-plugin-postcss');
const svg = require('rollup-plugin-svg');

export default withSolid({
  input: 'src/index.tsx',
  plugins: [
    terser(),
    postcss({
      plugins: [
        require('autoprefixer')(
          {
            overrideBrowserslist: ['> 0.15% in CN']
          })
      ]
    }),
    svg()
  ],
  output: [
    {
      file: 'dist/go-captcha-solid.cjs.js',
      format: 'cjs',
    },
    {
      file: 'dist/go-captcha-solid.esm.js',
      format: 'esm',
    }
  ],
});
