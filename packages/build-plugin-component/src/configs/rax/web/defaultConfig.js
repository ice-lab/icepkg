module.exports = {
  headPrepend: [
    {
      tag: 'meta',
      charset: 'utf-8',
      tagId: 'meta-charset',
    },
    {
      tag: 'meta',
      'http-equiv': 'x-ua-compatible',
      content: 'ie=edge,chrome=1',
      tagId: 'meta-compatible',
    },
    {
      tag: 'meta',
      name: 'viewport',
      content: 'width=device-width',
      tagId: 'meta-viewport',
    },
  ],
  headAppend: [
    {
      tag: 'title',
      innerHTML: 'DEMO 预览',
    },
  ],
  rootContainer: '<div id="root"></div>',
};
