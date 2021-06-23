import React from 'react';
import styles from './codebox.module.scss';

const O2Sandbox = ({ cssContent, jsCode, pkg }) => {
  const sandboxPackage = {
    ...pkg,
    name: 'o2-dependencies',
    dependencies: {
      ...(pkg.dependencies || {}),
      [pkg.name]: pkg.version,
    },
  };
  const files = [
    {
      path: 'index.tsx',
      content: encodeURIComponent(`// inject global dependencies\nimport { mountNode } from './config';\nimport './index.css'\n${jsCode}`),
    },
    {
      path: 'index.css',
      content: encodeURIComponent(cssContent),
    },
    {
      path: 'config.ts',
      content: encodeURIComponent("const mountNode = document.getElementById('root');\nexport { mountNode };"),
    },
    {
      path: "package.json",
      content: encodeURIComponent(JSON.stringify(sandboxPackage, null, '\t')),
    },
  ];

  return (
    <form action="https://o2.alibaba-inc.com/sandbox/define" method="POST" target="_blank" className={styles.codeAction}>
      <input type="hidden" name="data" value={`{\"name\":\"demo\",\"tags\":[\"fusion\"],\"type\":\"sandpack\",\"entry\":\"src/index.tsx\",\"files\":${JSON.stringify(files)}}`} />
      <button
        type="submit"
        title="O2"
        className={styles.codeAction}
      >
        <img src="https://img.alicdn.com/imgextra/i2/O1CN01PXrJdC1P94PhRKEWe_!!6000000001797-2-tps-222-222.png" width="20" height="20" />
      </button>
    </form>
  );
};

export default O2Sandbox;
