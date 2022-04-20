import React, { useState } from 'react';
import CodeBlock from '@theme-original/CodeBlock';
import ReactTooltip from 'react-tooltip';
import copy from 'copy-text-to-clipboard';
import { UnfoldSvg, CopySvg } from './svgs';
import styles from './styles.module.css';

function PcPreview({ children, code }) {
  const [unfold, triggerFold] = useState(false);

  const doCopy = () => {
    copy(code);
  };

  return (
    <div>
      <div className={[styles.container, !unfold && styles.unfoldContainer].filter(Boolean).join(' ')}>
        {/* Preview Demo Content */}
        <div className={styles.preview}>
          {children}
        </div>

        <ReactTooltip
          effect="solid"
          />

        <div className={styles.operations}>
          <div
            className={styles.item}
            onClick={() => doCopy()}
          ><CopySvg /></div>

          <div
            className={styles.item}
            onClick={() => triggerFold((fold) => !fold)}
            data-tip={ unfold ? '收起' : '展开'}
          ><UnfoldSvg /></div>
        </div>

      </div>

      <div className={styles.codeWrapper}>
      { unfold && (
        <CodeBlock
          children={code}
          className="language-jsx"
          mdxType= "code"
          originalType="code"
          parentName="pre"
      />
      ) }
      </div>


    </div>

  );
}

export default PcPreview;
