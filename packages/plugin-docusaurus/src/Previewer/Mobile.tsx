import React, { useRef, useState } from 'react';
import CodeBlock from '@theme-original/CodeBlock';
import { QRCodeSVG } from 'qrcode.react';
import styles from './styles.module.css';
import './styles.css';

function ReloadSvg(props) {
  return (
    <svg width="20px" height="20px" viewBox="0 0 16 16" {...props}><g fill="currentColor"><path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"></path><path fillRule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182a.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"></path></g></svg>
  );
}

function FullScreenSvg(props) {
  return (
    <svg width="15px" height="15px" viewBox="0 0 16 16" {...props}><path fill="currentColor" fillRule="evenodd" d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707zm0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707zm-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707z"></path></svg>
  );
}

function QrCodeSvg(props) {
  return (
    <svg width="20px" height="20px" viewBox="0 0 1024 1024" {...props} version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2552"><path d="M468 128H160c-17.7 0-32 14.3-32 32v308c0 4.4 3.6 8 8 8h332c4.4 0 8-3.6 8-8V136c0-4.4-3.6-8-8-8z m-56 284H192V192h220v220z" p-id="2553" fill="#666666"></path><path d="M274 338h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zM468 548H136c-4.4 0-8 3.6-8 8v308c0 17.7 14.3 32 32 32h308c4.4 0 8-3.6 8-8V556c0-4.4-3.6-8-8-8z m-56 284H192V612h220v220z" p-id="2554" fill="#666666"></path><path d="M274 758h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zM864 128H556c-4.4 0-8 3.6-8 8v332c0 4.4 3.6 8 8 8h332c4.4 0 8-3.6 8-8V160c0-17.7-14.3-32-32-32z m-32 284H612V192h220v220z" p-id="2555" fill="#666666"></path><path d="M694 338h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zM888 548h-48c-4.4 0-8 3.6-8 8v134h-78V556c0-4.4-3.6-8-8-8H556c-4.4 0-8 3.6-8 8v332c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V644h78v102c0 4.4 3.6 8 8 8h190c4.4 0 8-3.6 8-8V556c0-4.4-3.6-8-8-8z" p-id="2556" fill="#666666"></path><path d="M746 832h-48c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zM888 832h-48c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z" p-id="2557" fill="#666666"></path></svg>
  );
}

function MobilePreview({ code, url }) {
  const iframe = useRef(null);
  const [showDialog, setShowDialog] = useState(false);
  const redirctFullScreen = () => {
    window.open(url);
  };
  const reloadIframe = () => {
    iframe?.current?.contentWindow.location.reload();
  };

  const openQRCode = () => {
    setShowDialog(true);
  };

  const closeQrCode = () => {
    setShowDialog(false);
  };

  return (
    <div className={`${styles.mobileWrapper} mobile-previewer`}>
      <div className={styles.mobileCodeWrapper}>
        <CodeBlock
          children={code}
          className="language-jsx"
          mdxType= "code"
          originalType="code"
          parentName="pre" />
      </div>

      <div className={styles.mobilePreviewArea}>
        <div className={styles.mobileOperations}>
          <div
            className={styles.operationItem}
            onClick={reloadIframe}
            ><ReloadSvg /> &nbsp;刷新</div>
          <div
            className={styles.operationItem}
            onClick={redirctFullScreen}
            ><FullScreenSvg />  &nbsp;全屏模式</div>
          <div
            className={styles.operationItem}
            onClick={openQRCode}
            ><QrCodeSvg /> &nbsp;二维码</div>
        </div>
        <div className={styles.iframeWrapper}>
          <iframe
            ref={iframe}
            style={{ width: '325px', height: '600px', backgroundColor: '#FFF' }}
            scrolling="yes"
            frameBorder="0"
            src={url}
            />
          {showDialog && <div className={styles.dialog} onClick={closeQrCode}>
            <QRCodeSVG value={`${location.origin}${url}`} size={100}></QRCodeSVG>
          </div>}
        </div>

      </div>
    </div>
  );
}

export default MobilePreview;
