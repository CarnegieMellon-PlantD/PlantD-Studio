/* eslint-env node */
module.exports = {
  options: {
    resource: {
      loadPath: 'public/locales/{{lng}}/{{ns}}.json',
      savePath: 'public/locales/{{lng}}/{{ns}}.json',
    },
    func: {
      list: ['t'],
      extensions: ['.js', '.ts', '.jsx', '.tsx'],
    },
    lngs: ['en-US'],
    ns: ['translation'],
    defaultLng: 'en-US',
    defaultNs: 'translation',
    // Automatically purge unused keys
    removeUnusedKeys: true,
    // Automatically sort keys
    sort: true,
    // Allow keys to have `:` and `.`
    nsSeparator: false,
    keySeparator: false,
    // Since we use ICU already, don't generate context and plural keys
    context: false,
    plural: false,
    defaultValue: (lng, ns, key) => {
      if (lng === 'en-US') {
        // Return key as the default value for the default language (en-US)
        return key;
      }
      // Return the string '__NOT_TRANSLATED__' otherwise
      return '__NOT_TRANSLATED__';
    },
  },
};
