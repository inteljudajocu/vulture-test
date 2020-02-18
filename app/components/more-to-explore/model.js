'use strict';

const { search } = require('../../services/server/elastic');

function getArticleElastic(data, name) {
  let query = {
    _source: ['url', 'date', 'title', 'author', 'image'],
    size: 5,
    sort: [{ date: 'desc' }],
    query: {
      bool: {
        must_not: {
          query_string: {
            query: name,
            default_field: 'internalUrl'
          }
        }
      }
    }
  };

  return search('local_articles', query)
    .then(({ hits }) => hits.hits)
    .then(hits => hits.map(({ _source }) => _source))
    .then(res => {
      data.explore = res;

      return data;
    });
}

module.exports.render = function(uri, data, local) {
  return getArticleElastic(data, local.params.name).then(data => data);
};
