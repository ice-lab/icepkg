export default {
  processVal: function(val, defaultVal) {
    return val === undefined ? defaultVal : val;
  },
  processPlaceholderStyle: function(placeholderStyle, placeholderColor) {
    var style = placeholderStyle || '';
    if (placeholderColor) {
      style = 'color:' + placeholderColor + ';' + style;
    }
    return style;
  }
}
