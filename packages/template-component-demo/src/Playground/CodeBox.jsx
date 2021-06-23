import React from 'react';
import O2Sandbox from './O2Sandbox';
import styles from './codebox.module.scss';

export class CodeBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { check: false };
  }

  handleChange = () => {
    this.setState(prevState => ({ check: !prevState.check }));
  };

  render() {
    const {
      filename,
      children,
      highlightedCode,
      highlightedStyle,
      jsCode,
      cssContent,
      pkg,
    } = this.props;
    const { check } = this.state;
    if (!children) return null;
    return (
      <div className={styles.codeBox}>
        {filename && children && (
          <div className={styles.demo}>
            <div id={filename}>{children}</div>
          </div>
        )}
        <div className={styles.actions}>
          <O2Sandbox jsCode={jsCode} cssContent={cssContent} pkg={pkg} />
          <button
            type="button"
            title="Close editor"
            onClick={this.handleChange}
          >
            <span className={styles.codeAction}>
              <svg alt="expand code" width="20px" height="20px" viewBox="0 0 20 20" fill="currentColor">
                <path d="M14.4307124,13.5667899 L15.1349452,14.276759 L10.7473676,18.6288871 L6.42783259,14.2738791 L7.13782502,13.5696698 L10.7530744,17.2147744 L14.4307124,13.5667899 Z M4.79130753,8.067524 L16.3824174,11.1733525 L16.1235984,12.1392784 L4.53248848,9.03344983 L4.79130753,8.067524 Z M10.8154102,1.57503552 L15.1349452,5.93004351 L14.4249528,6.63425282 L10.809949,2.98914817 L7.13206544,6.6371327 L6.42783259,5.92716363 L10.8154102,1.57503552 Z" transform="translate(10.457453, 10.101961) rotate(90.000000) translate(-10.457453, -10.101961) "></path>
              </svg>
            </span>
          </button>
        </div>
        <div className="markdown code-wrapper" style={{ display: check ? 'block' : 'none' }}>
          {/* 高亮jsx */}
          {highlightedCode && (
            <div className="highlight">
              <pre>
                <code
                  lang="jsx"
                  dangerouslySetInnerHTML={{ __html: highlightedCode }}
                />
              </pre>
            </div>
          )}

          {/* 高亮style */}
          {highlightedStyle && (
            <div className="highlight">
              <pre>
                <code
                  lang="css"
                  dangerouslySetInnerHTML={{ __html: highlightedStyle }}
                />
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  }
}
