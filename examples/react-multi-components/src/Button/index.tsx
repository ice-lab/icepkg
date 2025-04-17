import * as React from 'react';
import './index.css';
import '../styles/common.css';

interface ButtonProps {
  type?: 'primary' | 'default';
}

const Button: React.FunctionComponent<React.PropsWithChildren<ButtonProps>> = (props) => {
  const { type = 'default' } = props;
  const typeCssSelector = {
    primary: 'pkg-btn-primary',
    default: 'pkg-btn-default',
  };
  return <button className={`pkg-btn ${typeCssSelector[type] || ''}`}>{props.children}</button>;
};

export default Button;
