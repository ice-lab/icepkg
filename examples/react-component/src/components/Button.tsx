import * as React from 'react';
import styles from './index.module.scss';

interface ButtonProps {
  onClick?: React.MouseEventHandler;
}

const Button: React.FunctionComponent<React.PropsWithChildren<ButtonProps>> = (props) => {
  return (
    <button className={styles.button} onClick={props.onClick}>{props.children}</button>
  );
};

export default Button;
