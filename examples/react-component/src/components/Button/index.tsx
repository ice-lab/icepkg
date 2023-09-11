import * as React from 'react';
import './index.scss';

interface ButtonProps {
  /**
   * 设置按钮类型
   */
  type?: 'primary' | 'default';
  /**
   * 点击跳转的地址，指定此属性 button 的行为和 a 链接一致
   */
  href?: string;
  /**
   * 显式加载状态
   */
  loading: boolean;
  /**
   * 点击按钮时的回调
   */
  onClick?: React.MouseEventHandler;
}

export const app: Application = { add: () => Promise.resolve(1) };

const Button: React.FunctionComponent<React.PropsWithChildren<ButtonProps>> = (props: ButtonProps) => {
  const {
    type = 'default',
  } = props;
  const typeCssSelector = {
    primary: 'pkg-btn-primary',
    default: 'pkg-btn-default',
  };
  return (
    <button
      className={`pkg-btn ${typeCssSelector[type] || ''}`}
      onClick={props.onClick}
      data-testid="normal-button"
    >
      {props.children}
    </button>
  );
};

Button.defaultProps = {
  type: 'default',
  onClick: () => { },
  href: undefined,
};

export default Button;
