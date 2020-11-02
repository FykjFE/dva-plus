import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import filesize from 'rollup-plugin-filesize';
import { uglify } from 'rollup-plugin-uglify';
const extensions = ['.js', '.ts'];
export default {
  input: './src/index.ts',
  output: {
    file: 'lib/index.js',
    name: 'dva',
    format: 'umd',
    sourcemap: true,
  },
  plugins: [
    uglify(),
    filesize(),
    resolve({
      extensions,
      modulesOnly: true,
    }),
    babel({
      exclude: 'node_modules/**',
      extensions,
    }),
  ],
};
