export function spread(
  target: Record<string, unknown>,
  sources: Array<Record<string, unknown>>,
): Record<string, unknown> {
  return Object.assign({}, target, ...sources);
}
