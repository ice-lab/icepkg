import * as React from 'react';
import PropTypes from 'prop-types';

export default class Input extends React.Component {
  render() {
    return (
      <>
        <input />
      </>
    );
  }
}

Input.propTypes = {
  /**
   * 输入框的 id
   */
  id: PropTypes.string,
  /**
   * 设置校验状态
   */
  status: PropTypes.string,
};
