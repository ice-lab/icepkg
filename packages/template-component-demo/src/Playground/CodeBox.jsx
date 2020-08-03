import React from 'react';
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
    } = this.props;
    const { check } = this.state;
    if (!children) return null;
    return (
      <div className={styles.codeBox}>
        {filename && children && (
          <div className={styles.demo}>
            <div id={filename} style={{ display: 'inline-block' }}>{children}</div>
          </div>
        )}
        <div className={styles.actions}>
          <button
            type="button"
            title="Close editor"
            onClick={this.handleChange}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
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
