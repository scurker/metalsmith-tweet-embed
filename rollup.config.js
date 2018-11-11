import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default {
  input: 'src/index.js',
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ],
  external: [...Object.keys(pkg.dependencies), 'path', 'querystring'],
  output: [
    {
      format: 'es',
      file: pkg.module
    },
    {
      format: 'cjs',
      file: pkg.main
    }
  ]
};