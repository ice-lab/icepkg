const render = require('./render');
const config = require('./config');

function init(window, document) {require('./bundle.js')(window, document)}

App(render.createAppConfig(init, config, ''));
