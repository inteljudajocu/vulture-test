'use strict';

const { search } = require('../../services/server/elastic');

function getArticleElastic(data, name) {
  const query = {
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

  return search('articles', query)
    .then(({ hits }) => hits.hits)
    .then(hits => hits.map(({ _source }) => _source))
    .then(res => {
      data.explore = res;

      return data;
    });
}

module.exports.render = function(uri, data, local) {
  let name = 'a';

  if (local.params == null) name = local.url;
  else name = local.params.name;
  return getArticleElastic(data, name).then(data => data);
};
