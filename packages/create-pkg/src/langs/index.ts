import { osLocale } from 'os-locale';
import zhCN from './zh-CN.js';
import enUS from './en-US.js';


let lang: string;

async function getLocale() {
  if (!lang) {
    return lang = await osLocale();
  }
  return lang;
}


export default async function getInfo() {
  const lang = await getLocale();
  if (lang.startsWith('zh')) {
    return zhCN;
  } else {
    return enUS;
  }
}
