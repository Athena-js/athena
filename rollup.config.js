import resolve from '@rollup/plugin-node-resolve';
import ttypescript from 'ttypescript';
import tsPlugin from 'rollup-plugin-typescript2';
import cleaner from 'rollup-plugin-cleaner';
import commonjs from '@rollup/plugin-commonjs';
import serve from 'rollup-plugin-serve';
import { string } from 'rollup-plugin-string';
import { terser } from 'rollup-plugin-terser';

const isProd = process.env.NODE_ENV === 'production';

const commonPlugins = [
  resolve(),
  commonjs(),
  tsPlugin({ typescript: ttypescript }),
  cleaner({ targets: ['dist'] }),
  string({ include: '**/*.wgsl' })
];

const devPlugins = () => [
  ...commonPlugins,
  serve({
    host: 'localhost',
    port: 4399,
    contentBase: ['docs', './']
  })
];

const prodPlugins = () => [...commonPlugins, terser()];

export default [
  {
    input: './src/index.ts',
    output: {
      dir: 'dist',
      format: 'umd',
      name: 'Athena',
      sourcemap: true
    },
    plugins: isProd ? prodPlugins() : devPlugins()
  }
];
