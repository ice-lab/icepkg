export function spread(target, sources) {
  return Object.assign({}, target, ...sources);
}
