import React from 'react';
import Sidebar from './Sidebar';
import styles from './index.module.scss';

export const Layout = ({ demos, children, matchedFilename }) => {
  const items = (demos || []).sort((a, b) => a.order - b.order);
  return (
    <div>
      <div className={styles.nav}>Docs</div>
      <div className={styles.container}>
        <Sidebar items={items} matchedFilename={matchedFilename} />
        <div className={styles.main}>{children}</div>
      </div>
    </div>
  );
};

export class BuildLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentHash: window.location.hash,
    };
  }

  handleChangeHash = () => {
    setTimeout(() => {
      // update currentHash after location changed
      this.setState({
        currentHash: window.location.hash,
      });
    }, 0);
    
  }

  render() {
    const { demos, children } = this.props;
    const { currentHash } = this.state;
    return (
      <div>
        <div className={styles.layout}>
          {children}
        </div>
        <ul className={styles.fixNav}>
          {demos.map((item) => {
            return (
              <li key={item.filename} className={currentHash.replace('#container_', '') === item.filename ? styles.selected : ''}>
                <a href={`#container_${item.filename}`} onClick={this.handleChangeHash}>{item.title || item.filename}</a>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}