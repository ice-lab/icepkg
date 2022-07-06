import React, { useState } from 'react';
import CodeBlock from '@theme-original/CodeBlock';
import ReactTooltip from 'react-tooltip';
import copy from 'copy-text-to-clipboard';
import styles from './styles.module.css';

function UnfoldSvg() {
  return (
    <svg
      width="20px"
      height="20px"
      viewBox="0 0 20 20"
      fill="currentColor"
      >
      <path d="M14.4307124,13.5667899 L15.1349452,14.276759 L10.7473676,18.6288871 L6.42783259,14.2738791 L7.13782502,13.5696698 L10.7530744,17.2147744 L14.4307124,13.5667899 Z M4.79130753,8.067524 L16.3824174,11.1733525 L16.1235984,12.1392784 L4.53248848,9.03344983 L4.79130753,8.067524 Z M10.8154102,1.57503552 L15.1349452,5.93004351 L14.4249528,6.63425282 L10.809949,2.98914817 L7.13206544,6.6371327 L6.42783259,5.92716363 L10.8154102,1.57503552 Z" transform="translate(10.457453, 10.101961) rotate(90.000000) translate(-10.457453, -10.101961) "></path>
    </svg>
  );
}

function CopySvg() {
  return (
    <svg viewBox="0 0 20 20" focusable="false" data-icon="snippets" width="20px" height="20px" fill="currentColor" aria-hidden="true">
      <path d="M15,5 L15,18 L2,18 L2,5 L15,5 Z M14,6 L3,6 L3,17 L14,17 L14,6 Z M18,2 L18,15 L16,15 L16,13.999 L17,14 L17,3 L6,3 L6,4 L5,4 L5,2 L18,2 Z M9,8 L9,11 L12,11 L12,12 L9,12 L9,15 L8,15 L8,12 L5,12 L5,11 L8,11 L8,8 L9,8 Z"></path>
    </svg>
  );
}

function FullScreenSvg(props) {
  return (
    <svg width="15px" height="15px" viewBox="0 0 16 16" {...props}><path fill="currentColor" fillRule="evenodd" d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707zm0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707zm-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707z"></path></svg>
  );
}


function PcPreview({ children, code, url }) {
  const [unfold, triggerFold] = useState(false);

  const doCopy = () => {
    copy(code);
  };

  const redirctFullScreen = () => {
    window.open(url);
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
            data-tip="复制"
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
