import decamelize from 'decamelize';

export function generateNpmName(name: string, npmScope?: string): string {
  // WebkitTransform -> webkit-transform
  const decamelizeName = decamelize(name, { separator: '-' });
  return npmScope ? `${npmScope}/${decamelizeName}` : decamelizeName;
}
