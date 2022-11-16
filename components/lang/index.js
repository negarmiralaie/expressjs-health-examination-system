const localizify = require('localizify');

const fa = require('./messages/fa.json');

const localize = localizify.default.add('fa', fa).setLocale('fa');

module.exports = localize;
