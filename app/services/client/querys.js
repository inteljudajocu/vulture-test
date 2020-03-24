'use strict';

const rest = require('../../services/universal/rest');

function searchQuery(index, query) {
  return rest.get('localhost/_search', {
    index,
    body: query
  });
}

module.exports.searchQuery = searchQuery;
