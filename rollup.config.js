import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
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
