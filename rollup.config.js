import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';
import serve from 'rollup-plugin-serve';
import { string } from 'rollup-plugin-string';
import { terser } from 'rollup-plugin-terser';
import * as path from 'path';

const isProd = process.env.NODE_ENV === 'production';
const projectRootDir = path.resolve(__dirname);

const resolver = resolve({
  extensions: ['.js', '.wgsl']
});

const commonPlugins = [
  resolve(),
  commonjs(),
  typescript(),
  alias({
    entries: [{ find: '@', replacement: path.resolve(projectRootDir, 'src') }],
    resolver
  }),
  string({
    include: '**/*.wgsl'
  })
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
