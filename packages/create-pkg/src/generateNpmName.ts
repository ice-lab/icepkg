import decamelize from 'decamelize';

export function generateNpmName (name: string, npmScope?: string): string {
  // WebkitTransform -> webkit-transform
  name = decamelize(name, { separator: '-' });
  return npmScope ? `${npmScope}/${name}` : name;
}
