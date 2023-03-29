import * as docgen from 'react-docgen';
import fse = require('fs-extra');

export default function generateComponentInfo(componentPath: string) {
  return docgen.parse(fse.readFileSync(componentPath, 'utf-8'));
}
