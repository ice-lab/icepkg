import consola from 'consola';
import picocolors from 'picocolors';
import { gzipSizeSync } from 'gzip-size';

const UNIT = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];

const prettifySize = (bytes: number): string => {
  if (bytes === 0) return '0 B';

  const exp = Math.floor(Math.log2(bytes) / 10);
  return `${`${(bytes / Math.pow(1024, exp)).toFixed(2)}`.replace(/\.00/, '')} ${UNIT[exp]}`;
};

const findMaxLength = (names: string[]) => {
  return names.map((name) => name.length).sort((a, b) => b - a)[0];
};

export const reportSize = (files: { [name: string]: string }) => {
  const names = Object.keys(files);
  const maxLen = findMaxLength(names);
  const padLength = maxLen > 35 ? maxLen + 2 : 35;

  names.forEach((name) => {
    const rawSize = prettifySize(files[name].length);
    const gzipSize = prettifySize(gzipSizeSync(files[name]));
    consola.info(`${name.padStart(padLength, ' ')}: ${rawSize}, ${picocolors.cyan('Gzipped')} ${gzipSize}`);
  });
};
