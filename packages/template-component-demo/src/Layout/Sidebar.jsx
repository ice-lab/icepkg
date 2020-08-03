import React from 'react';
import { Link } from 'react-router-dom';
import styles from './sidebar.module.scss';

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '', menus: props.items };
  }

  handleChange = evt => {
    const value = evt.target.value || '';
    const menus = this.props.items.filter(item => {
      const title = item.title.toLocaleLowerCase();
      const val = value.toLocaleLowerCase();
      return title.includes(val);
    });
    this.setState({ value, menus });
  };

  render() {
    const { matchedFilename } = this.props;
    const { value, menus } = this.state;

    return (
      <div className={styles.sidebar}>
        <div className={styles.searchbox}>
          <input
            type="text"
            className={styles.input}
            placeholder="Type to search..."
            value={value}
            onChange={this.handleChange}
          />
        </div>
        <dl className={styles.menuList}>
          {menus.map((item, key) => (
            <dt
              className={`${styles.item}${matchedFilename === item.filename ? ` ${styles.selected}` : ''}`}
              key={`${item.filename}-${key}`}
            >
              <Link to={`/${item.filename}`}>{item.title}</Link>
            </dt>
          ))}
        </dl>
      </div>
    );
  }
}
