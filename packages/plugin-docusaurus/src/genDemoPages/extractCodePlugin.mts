import visit from 'unist-util-visit';
import { getDemoFileInfo, getPageFileInfo } from '../remark/getFileInfo.js';
import checkCodeLang from '../remark/checkCodeLang.js';
import genDemoPages from '../remark/genDemoPages.js';

interface MdNode {
  type: string;
  meta: string;
  lang: string;
  value: string;
}

export default function getExtractCodePlugin(filepath: string, rootDir: string) {
  return function extractCodePlugin() {
    return async (ast) => {
      await visit<MdNode>(ast, 'code', (node) => {
        if (node.meta === 'preview') {
          const { lang } = node;
          checkCodeLang(lang);
          const { demoFilename, demoFilepath } = getDemoFileInfo({ rootDir, code: node.value, lang, filepath });
          const { pageFilename, pageFileCode } = getPageFileInfo({ rootDir, demoFilepath, demoFilename });
          genDemoPages({
            filepath,
            code: node.value,
            demoFilename,
            demoFilepath,
            pageFilename,
            pageFileCode,
          });
        }
      });
    };
  };
}
