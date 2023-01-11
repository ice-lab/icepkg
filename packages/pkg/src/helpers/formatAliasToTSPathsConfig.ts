import { TaskConfig } from '../types.js';

export default function formatAliasToTSPathsConfig(alias: TaskConfig['alias']) {
  const paths: { [from: string]: [string] } = {};

  Object.entries(alias || {}).forEach(([key, value]) => {
    const [pathKey, pathValue] = formatPath(key, value);
    paths[pathKey] = [pathValue];
  });

  return paths;
}

function formatPath(key: string, value: string) {
  if (key.endsWith('$')) {
    return [key.replace(/\$$/, ''), value];
  }
  // abc -> abc/*
  // abc/ -> abc/*
  return [addWildcard(key), addWildcard(value)];
}

function addWildcard(str: string) {
  return `${str.endsWith('/') ? str : `${str}/`}*`;
}
