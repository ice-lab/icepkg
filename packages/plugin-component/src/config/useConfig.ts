export const registerdUserConfig = [
  {
    name: 'alias',
    validation: 'object',
    defaultValue: {},
  },
  {
    name: 'define',
    validation: 'object',
    defaultValue: {},
  },
  {
    name: 'sourceMaps',
    validation: (val: boolean | 'inline') => {
      return typeof val === 'boolean' || val === 'inline';
    },
    defaultValue: false,
  },
  {
    name: 'generateTypesForJs',
    validation: 'boolean',
    default: false,
  },
  // FIXME: validate values recursivly
  {
    name: 'transform',
    validation: 'object',
    defaultValue: {
      formats: ['esm', 'es2017'],
    },
  },
  {
    name: 'bundle',
    validation: 'object',
    defaultValue: {
      formats: ['esm', 'es2017'],
    },
  },
];
