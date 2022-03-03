import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';

export default [
  {
    input: './src/index.ts',
    output: {
      dir: 'dist',
      format: 'umd',
      name: 'athena',
      sourcemap: true
    },
    plugins: [resolve(), commonjs(), typescript()]
  }
];
