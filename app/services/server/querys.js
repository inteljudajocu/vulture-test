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

function _idQuery(index, id) {
  const query = {
    query: {
      term: {
        _id: toPublished(id)
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

/**
 *
 * @param {Object} query
 * @returns {Promise}
 */
function respondPromise(query) {
  return query.then(({ hits }) => hits.hits).then(hits => hits.map(({ _source }) => _source));
}

function toPublished(id) {
  return id + '@published';
}

function getPageName(local) {
  return local.params ? local.params.name : local.url;
}

module.exports.rawQuery = rawQuery;
module.exports.idQuery = idQuery;
module.exports._idQuery = _idQuery;
module.exports.idQuerySourceByDate = idQuerySourceByDate;
module.exports.idQuerySource = idQuerySource;
module.exports.queryIndexTagsByDate = queryIndexTagsByDate;
module.exports.getPageName = getPageName;
