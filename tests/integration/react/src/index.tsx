import React from 'react';

export default () => {
  const commonProps: Record<string, any> = {
    className: 'common-class-name',
  };
  return <div {...commonProps}>Hello World</div>;
};
