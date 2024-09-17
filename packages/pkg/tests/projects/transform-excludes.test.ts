import { ALL_TRANSFORM_FORMATS, runProjectTest } from "./helper";

runProjectTest('transform-excludes', [{
  name: 'excludes',
  snapshot: 'structure',
  config: {
    transform: {
      formats: ALL_TRANSFORM_FORMATS,
      excludes: ['**/n*.ts'],
    },
    declaration: false
  }
}, {
  name: 'compile-excludes',
  config: {
    transform: {
      formats: ALL_TRANSFORM_FORMATS,
      compileExcludes: ['**/*.min.js'],
    },
    declaration: false,
  }
}])
