'use strict';

const { search } = require('./elastic');

function rawQuery(index) {
  const query = {
    query: {
      match_all: {}
    }
  };

  return respondPromise(search(index, query));
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

  return respondPromise(search(index, query));
}

function idQuerySource(index, id, filterField, source) {
  const query = {
    _source: source,
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

  return respondPromise(search(index, query));
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

  return respondPromise(search(index, query));
}

function queryIndexTagsByDate(index, tags, source) {
  const query = {
    _source: source,
    size: 5,
    sort: [{ date: 'desc' }],
    query: {
      bool: {
        must: [
          {
            terms: {
              'items.text': tags
            }
          }
        ]
      }
    }
  };

  return respondPromise(search(index, query));
}

function respondPromise(query) {
  return query
    .then(({ hits }) => hits.hits)
    .then(hits => hits.map(({ _source }) => _source))
    .then(res => {
      return res;
    });
}

module.exports.rawQuery = rawQuery;
module.exports.idQuery = idQuery;
module.exports.idQuerySourceByDate = idQuerySourceByDate;
module.exports.idQuerySource = idQuerySource;
module.exports.queryIndexTagsByDate = queryIndexTagsByDate;
