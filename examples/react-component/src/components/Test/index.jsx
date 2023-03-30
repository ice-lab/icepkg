import PropTypes from 'prop-types';
import * as React from 'react';
import './index.css';
/**
 * Test component
 */
const Test = ({ title }) => {
  // eslint-disable-next-line
  console.log(__DEV__);
  console.log(process.env.NODE_ENV);

  const [visible, setVisible] = React.useState(false);
  return (
    <div>
      <h1 style={{ fontSize: '100rpx' }} data-testid="title">{title}</h1>
      <button onClick={() => setVisible(!visible)}>Click Me to Set Visible</button>

      <div>
        <div x-if={visible}>Hello</div>
        <div x-else>World</div>
      </div>
    </div>
  );
};

Test.propTypes = {
  /**
   *
   */
  title: PropTypes.string,
  /**
   *
   */
  baz: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

  /**
   *
   */
  bar(props, propName, componentName) {
    // ...
  },
};

Test.defaultProps = {
  title: 'Hello World',
  bar: () => {},
  baz: 'baz',
};

export default Test;
