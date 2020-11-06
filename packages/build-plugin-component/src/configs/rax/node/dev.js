const path = require('path');
const Module = require('module');
const { parse, print } = require('error-stack-tracey');
const setCSSRule = require('../../../utils/setCSSRule');

function exec(code, filename, filePath) {
  const module = new Module(filename, this);
  // eslint-disable-next-line
  module.paths = Module._nodeModulePaths(filePath);
  module.filename = filename;
  // eslint-disable-next-line
  module._compile(code, filename);
  return module.exports;
}

module.exports = (config, context, options) => {
  const { rootDir } = context;
  const { serverBundles } = options;

  Object.keys(serverBundles).forEach((entryKey) => {
    config
      .entry(`${entryKey}-ssr`)
      .add(serverBundles[entryKey]);
  });

  config.target('node');
  config.output
    .path(rootDir)
    .libraryTarget('commonjs2');

  config.output.filename('ssr/[name].js');

  if (options.inlineStyle) {
    setCSSRule(config, true);
  } else {
    config.plugins.delete('minicss');

    config.module.rules.delete('css');
    config.module.rule('css')
      .test(/\.css?$/)
      .use('ignorecss')
      .loader(require.resolve('./ignoreLoader'))
      .end();

    config.module.rules.delete('less');
    config.module.rule('less')
      .test(/\.less?$/)
      .use('ignorecss')
      .loader(require.resolve('./ignoreLoader'))
      .end();
  }


  config.devServer.set('before', (app, devServer) => {
    const outputFs = devServer.compiler.compilers[0].outputFileSystem;

    Object.keys(serverBundles).forEach((entryKey) => {
      app.get(`/ssr/${entryKey}`, async (req, res) => {
        const query = req.query || {};
        // disable hydarte for debug http://localhost:9999/ssr/index?hydrate=false
        const hydrate = query.hydrate !== 'false';

        const bundleContent = outputFs.readFileSync(path.join(rootDir, `ssr/${entryKey}-ssr.js`), 'utf8');

        let content;

        try {
          const mod = exec(bundleContent, entryKey, serverBundles[entryKey]);
          content = mod.default();
        } catch (error) {
          const errorStack = await parse(error, bundleContent);
          print(error.message, errorStack);

          const stackMessage = errorStack.map(frame => frame.source);
          content = `Error: ${error.message}<br>${stackMessage.join('<br>')}`;
        }

        const existsCSS = outputFs.existsSync(path.join(rootDir, `dist/${entryKey}.css`));
        const style = existsCSS ? `<link href="/${entryKey}.css" rel="stylesheet">` : '';
        const srcipt = hydrate ? `<script type="text/javascript" src="/${entryKey}.js"></script>` : '';

        const html = `
          <!doctype html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, minimum-scale=1, user-scalable=no">
              <title>Rax Component Demo</title>
              ${style}
            </head>
            <body style="padding: 0;margin: 0">
              <div id="root">${content}</div>
              ${srcipt}
            </body>
          </html>`;
        res.send(html);
      });
    });
  });
};
