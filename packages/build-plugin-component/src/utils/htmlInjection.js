const cloneDeep = require('lodash.clonedeep');

const htmlContentStorage = {};
const multiHTMLContentStorage = {};
const HTML_POSITIONS = {
  headAppend: {
    defaultValue: [],
    type: 'array',
  },
  headPrepend: {
    defaultValue: [],
    type: 'array',
  },
  bodyAppend: {
    defaultValue: [],
    type: 'array',
  },
  bodyPrepend: {
    defaultValue: [],
    type: 'array',
  },
  htmlAttrs: {
    defaultValue: '',
    type: 'object',
  },
  headAttrs: {
    defaultValue: '',
    type: 'object',
  },
  bodyAttrs: {
    defaultValue: '',
    type: 'object',
  },
  rootContainer: {
    defaultValue: [],
    type: 'string',
  },
};
const TAGS_INFO = {
  meta: {
    selfClosing: true,
  },
  title: {},
  link: {
    selfClosing: true,
  },
  style: {},
  script: {},
};

function injectHTML(callback, position) {
  if (!Object.keys(HTML_POSITIONS).includes(position)) {
    console.warn('[user config]', `unknown position ${position}.`);
  }
  // store html content added by applyMethod
  htmlContentStorage[position] = callback(htmlContentStorage[position]);
}

function parseHTMLContent(content) {
  if (Object.prototype.toString.call(content) === '[object Object]') {
    const { tag, innerHTML, tagId, ...attrs } = content;
    const { selfClosing } = TAGS_INFO[tag];
    const attrStr = parseHTMLAttrs(attrs);
    return selfClosing && !innerHTML ? `<${tag}${attrStr}/>` : `<${tag}${attrStr}>${innerHTML}</${tag}>`;
  }
  return content;
}

function parseHTMLAttrs(attrs) {
  const attrKeys = Object.keys(attrs);
  return attrKeys.length ? ` ${attrKeys.map((attrKey) => `${attrKey}="${attrs[attrKey]}"`).join(' ')}` : '';
}

function getHTMLParams(htmlContent) {
  const htmlParams = {};
  Object.keys(htmlContent).forEach((htmlPosition) => {
    const htmlTags = htmlContent[htmlPosition];
    htmlParams[htmlPosition] = Array.isArray(htmlTags) ? htmlTags.map((htmlTag) => parseHTMLContent(htmlTag)).join('\n') : parseHTMLContent(htmlTags);
  });
  return htmlParams;
}

function modifyHTMLPluginOptions(config, pluginName, options, params) {
  if (config.plugins.get(pluginName)) {
    // spa HtmlWebpackPlugin
    config.plugin(pluginName).tap(([args]) => {
      const defaultValues = {};
      Object.keys(HTML_POSITIONS).forEach((positionKey) => {
        defaultValues[positionKey] = HTML_POSITIONS[positionKey].defaultValue;
      });

      /**
       * for getDemoConfig needs extra info to inject to html.
       * merge htmlAppendInjection to params for getDemoConfig.
       */
      const { htmlAppendInjection } = args || {};

      const _params = {
        ...params,
      };

      if (htmlAppendInjection) {
        Object.keys(htmlAppendInjection).forEach((position) => {
          // eslint-disable-next-line no-param-reassign
          _params[position] = (_params[position] || '').concat(htmlAppendInjection[position]);
        });
      }

      const pluginOptions = {
        ...args,
        templateParameters: {
          ...(args.templateParameters || {}),
          ...defaultValues, // default value of html positions
          ..._params,
        },
        ...options,
      };
      return [pluginOptions];
    });
  }
}

function configHTMLPlugin(config) {
  const htmlParams = getHTMLParams(htmlContentStorage);
  const htmlPluginOptions = {
    inject: false,
  };
  const entry = config.entryPoints.entries();
  // mpa HtmlWebpackPlugin
  if (Object.prototype.toString.call(entry) === '[object Object]' && Object.keys(entry).length > 1) {
    // delete multi HtmlWebpackPlugin
    Object.keys(entry).forEach((entryKey) => {
      const pluginName = `HtmlWebpackPlugin_${entryKey}`;
      modifyHTMLPluginOptions(
        config,
        pluginName,
        htmlPluginOptions,
        multiHTMLContentStorage[entryKey] ? getHTMLParams(multiHTMLContentStorage[entryKey]) : htmlParams,
      );
    });
  } else {
    modifyHTMLPluginOptions(config, 'HtmlWebpackPlugin', htmlPluginOptions, htmlParams);
  }
}

function configHTMLContent(htmlInjection, entryKey) {
  let storage = htmlContentStorage;
  if (entryKey) {
    multiHTMLContentStorage[entryKey] = cloneDeep(htmlContentStorage);
    storage = multiHTMLContentStorage[entryKey];
  }
  Object.keys(htmlInjection).forEach((optionKey) => {
    if (HTML_POSITIONS[optionKey]) {
      const { type } = HTML_POSITIONS[optionKey];
      const value = htmlInjection[optionKey];
      if (type === 'array') {
        const newValue = [];
        // overwrite content by tagId / unique tag
        value.forEach((tagInfo) => {
          const { tagId, tag } = tagInfo;
          let index = -1;
          if (tag === 'title') {
            index = (storage[optionKey] || []).findIndex((item) => item.tag === tag);
          } else if (tagId) {
            index = (storage[optionKey] || []).findIndex((item) => item.tagId === tagId);
          }

          if (index > -1) {
            storage[optionKey][index] = tagInfo;
          } else {
            newValue.push(tagInfo);
          }
        });
        storage[optionKey] = (storage[optionKey] || []).concat(newValue);
      } else if (type === 'object') {
        storage[optionKey] = {
          ...(storage[optionKey] || {}),
          ...value,
        };
      } else {
        storage[optionKey] = value;
      }
    }
  });
}

exports.configWebpack = (htmlInjection) => {
  if (htmlInjection) {
    configHTMLContent(htmlInjection);
  }
};

exports.configHTMLPlugin = configHTMLPlugin;
exports.configHTMLContent = configHTMLContent;
