import * as React from 'react';

interface ButtonProps {

}

const Button: React.FunctionComponent<React.PropsWithChildren<ButtonProps>> = (props) => {
  return (
    <div>{props.children}</div>
  );
};

export default Button;
