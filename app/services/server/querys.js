'use strict';

const { search } = require('./elastic');

function rawQuery(index) {
  const query = {
    query: {
      match_all: {}
    }
  };

  return search(index, query);
}

function idQuery(index, id, filterField) {
  const query = {
    size: 1,
    query: {
      bool: {
        must: {
          query_string: {
            query: id,
            default_field: filterField
          }
        }
      }
    }
  };

  return search(index, query);
}

function idQuerySourceByDate(index, id, filterField, source) {
  const query = {
    _source: source,
    size: 5,
    sort: [{ date: 'desc' }],
    query: {
      bool: {
        must_not: {
          query_string: {
            query: id,
            default_field: filterField
          }
        }
      }
    }
  };

  return search(index, query);
}

module.exports.rawQuery = rawQuery;
module.exports.indexQuery = idQuery;
module.exports.idQuerySourceByDate = idQuerySourceByDate;
