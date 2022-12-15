import * as React from 'react';

interface ButtonProps {

}

const Button: React.FunctionComponent<React.PropsWithChildren<ButtonProps>> = (props) => {
  return (
    <button>{props.children}</button>
  );
};

export default Button;
