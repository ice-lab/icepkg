import * as React from 'react';

interface ButtonProps {
  onClick?: React.MouseEventHandler;
}

const Button: React.FunctionComponent<React.PropsWithChildren<ButtonProps>> = (props) => {
  return (
    <button onClick={props.onClick}>{props.children}</button>
  );
};

export default Button;
