/**
 * This plugin is used to handle postcss only in transform task
 */
import postcss from 'postcss';
import PostcssPluginRpxToVw from 'postcss-plugin-rpx2vw';
import { stylesFilter } from '../../utils.js';

const rpx2vwPlugin = () => {
  return {
    name: 'ice-pkg:transform-rpx2vw',

    async transform(code, id) {
      // only transform source code;
      if (!stylesFilter(id)) {
        return null;
      }

      const result = await postcss(PostcssPluginRpxToVw).process(code);
      return {
        code: result.css,
        map: null,
      };
    },
  };
};

export default rpx2vwPlugin;
