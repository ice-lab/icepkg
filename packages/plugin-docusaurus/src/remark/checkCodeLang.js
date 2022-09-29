function checkCodeLang(lang) {
  if (!['tsx', 'jsx'].includes(lang)) {
    throw new Error(`
      Found code block with lang ${lang}.\n\
      ${lang} is not supported in code preview.
    `);
  }
}

module.exports = checkCodeLang;
