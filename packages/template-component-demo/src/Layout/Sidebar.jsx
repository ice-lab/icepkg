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
    const menus = this.props.items.filter(menu => {
      const item = Array.isArray(menu) ? menu[0] : menu;
      const title = (item.demoKey || item.title).toLocaleLowerCase();
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
        <div className={styles.searchbox} style={{ display: 'none' }}>
          <input
            type="text"
            className={styles.input}
            placeholder="Type to search..."
            value={value}
            onChange={this.handleChange}
          />
        </div>
        <dl className={styles.menuList}>
          {menus.map((menu, key) => {
            const item = Array.isArray(menu) ? menu[0] : menu;
            return (
              <dt
                className={`${styles.item}${matchedFilename === (item.demoKey || item.filename) ? ` ${styles.selected}` : ''}`}
                key={`${item.demoKey || item.filename}-${key}`}
              >
                <Link to={`?demo=${item.demoKey || item.filename}`}>{item.demoKey || item.title}</Link>
              </dt>
            );
          })}
        </dl>
      </div>
    );
  }
}
