import React, { useState } from 'react';
import CodeBlock from '@theme-original/CodeBlock';
import copy from 'copy-text-to-clipboard';
import styles from './styles.module.css';
import './styles.css';

function BiArrowRepeat(props) {
  return (
    <svg width="20px" height="20px" viewBox="0 0 16 16" {...props}><g fill="currentColor"><path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"></path><path fillRule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182a.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"></path></g></svg>
  );
}

function BiArrowsFullscreen(props) {
  return (
    <svg width="15px" height="15px" viewBox="0 0 16 16" {...props}><path fill="currentColor" fillRule="evenodd" d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707zm0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707zm-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707z"></path></svg>
  );
}

function MobilePreview({ code, url }) {
  console.log('MobilePreview-----', url);
  const redirctFullScreen = () => {
    window.open(url);
  };
  return (
    <div className={`${styles.mobileWrapper} mobile-previewer`}>
      <div className={styles.mobileCodeWrapper}>
        <div className={styles.mobleOperations}>
            <div className={styles.previewOpreations}>
              <div className={styles.operationItem}><BiArrowRepeat /> &nbsp;刷新</div>
        <div className={styles.operationItem}><BiArrowsFullscreen />  &nbsp;全屏模式</div>
          </div>
        </div>
      <CodeBlock
        children={code}
        className="language-jsx"
        mdxType= "code"
        originalType="code"
        parentName="pre" />
      </div>

      <div className={styles.mobilePreviewArea}>
        <div className={styles.mobleOperations}>
          <div className={styles.previewOpreations}>
            <div className={styles.operationItem}><BiArrowRepeat /> &nbsp;刷新</div>
            <div
              className={styles.operationItem}
              onClick={redirctFullScreen}
              ><BiArrowsFullscreen />  &nbsp;全屏模式</div>
          </div>
        </div>
        <div className={styles.iframeWrapper}>
          <iframe
            style={{ width: '325px', height: '640px', backgroundColor: '#FFF' }}
            scrolling="yes"
            frameBorder="0"
            src={url}
            />
        </div>
      </div>
    </div>
  );
}

export default MobilePreview;
