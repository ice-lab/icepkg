const fse = require('fs-extra');
const path = require('path');
const util = require('util');
const marked = require('marked');
const prismjs = require('prismjs');
const yaml = require('js-yaml');
require('prismjs/components/prism-jsx');
require('prismjs/components/prism-bash');
require('prismjs/components/prism-json');

const renderer = new marked.Renderer();
// css injection
const styleTemplate = '<style>%s</style>';
const codeTemplate = `
  <div class="markdown">
    <div class="highlight highlight-%s">
      <pre><code language="%s">%s</code></pre>
    </div>
  </div>
`;

renderer.code = function (code, lang) {
  // lang = ''
  if (!lang) {
    lang = 'jsx';
  }
  const html = prismjs.highlight(
    code,
    prismjs.languages[lang] || prismjs.languages.html,
  );

  if (lang === 'css' || lang === 'style') {
    return util.format(styleTemplate, code);
  }
  return util.format(codeTemplate, lang, lang, html);
};

renderer.heading = function (text, level) {
  let escapedText = text.replace(/\s+/g, '-');
  escapedText = escapedText.toLowerCase();
  escapedText = escapedText.replace(/^-+?|-+?$/, '');
  return `<h${level}>${text}<a id="user-content-${escapedText}" name="${escapedText}" class="anchor" aria-hidden="true" href="#${escapedText}"><span class="octicon octicon-link"></span></a></h${level}>`;
};

renderer.link = function (href, title, text) {
  if (href.indexOf('http') === 0) {
    return `<a href="${href}" title="${title}">${text}</a>`;
  }
  const fileindex = href.lastIndexOf('/');
  const filename = href.substr(fileindex + 1);
  if (/^([-\w]+)\.md$/.test(filename)) {
    href = href.replace(/\.md$/, '.html');
  }
  title = title || text;
  return `<a href="${href}" title="${title}">${text}</a>`;
};

marked.setOptions({
  renderer,
});

exports.formatMarkdown = function formatMarkdown(md) {
  const markdownHtml = marked(md);
  return markdownHtml;
};

exports.markdownParser = function markdownParser(md, options = {}) {
  const { sliceCode, demoPath } = options;
  function split(str) {
    if (str.slice(0, 3) !== '---') return;
    const matcher = /\n(\.{3}|-{3})/g;
    const metaEnd = matcher.exec(str);
    return (
      metaEnd && [str.slice(0, metaEnd.index), str.slice(matcher.lastIndex)]
    );
  }

  const splited = split(md);
  const result = {
    meta: {},
    content: md,
    code: '',
  };

  if (splited) {
    result.meta = yaml.load(splited[0]);
    result.content = splited[1];
  }

  if (sliceCode) {
    const JSX_REG = /(```)(?:jsx?)([^\1]*?)(\1)/g;
    const STYLE_REG = /(```)(?:css|style?)([^\1]*?)(\1)/g;
    const DEMO_REG = /<DemoCode\b[^>]*src=['"]?([^'"]*)['"]?\b[^>]*>/;

    const jsxMatched = JSX_REG.exec(result.content);
    const styleMatched = STYLE_REG.exec(result.content);

    if (jsxMatched) {
      result.code = jsxMatched[2] || '';
      const demoMathed = DEMO_REG.exec(result.code);
      if (demoMathed && demoMathed[1] && demoPath) {
        try {
          result.demoCodeSrc = demoMathed[1];
          result.importCode = fse.readFileSync(path.join(demoPath, demoMathed[1]), 'utf-8');
        } catch (err) {
          console.log(`[error] fail to get demo code ${demoMathed[1]}`);
        }
      }
      result.content = result.content.replace(jsxMatched[0], '');
    }

    if (styleMatched) {
      const styleCode = styleMatched[2] || '';
      result.highlightedStyle = prismjs.highlight(
        styleCode.trim(),
        prismjs.languages.css,
      );
    }

    result.highlightedCode = prismjs.highlight(
      result.importCode ? result.importCode.trim() : result.code.trim(),
      prismjs.languages.jsx,
    );
  }
  result.content = marked(result.content);

  return result;
};
