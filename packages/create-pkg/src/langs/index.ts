import { osLocale } from 'os-locale';
import zhCN from './zh-CN.js';
import enUS from './en-US.js';

let lang: string;

async function getLocale() {
  if (!lang) {
    lang = await osLocale();
    return lang;
  }
  return lang;
}

export default async function getInfo() {
  const currentLang = await getLocale();
  if (currentLang.startsWith('zh')) {
    return zhCN;
  } else {
    return enUS;
  }
}
