'use strict';

const { elastic } = require('amphora-search');

function search(index, query) {
  return elastic.query(index, query);
}

function getDocument(index, id) {
  return elastic.getDocument(index, id);
}

module.exports.getDocument = getDocument;
module.exports.search = search;
