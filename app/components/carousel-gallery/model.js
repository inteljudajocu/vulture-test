'use strict';

const { search } = require('../../services/server/elastic'),
  query = {
    _source: ['image', 'title'],
    size: 4,
    from: 1,
    sort: [{ date: 'desc' }],
    query: {
      bool: {
        must: [
          {
            terms: {
              'items.text': ['pedro', 'steph']
            }
          }
        ]
      }
    }
  };

function getArticleElastic(data) {
  return search('local_articles', query)
    .then(({ hits }) => hits.hits)
    .then(hits => hits.map(({ _source }) => _source))
    .then(res => {
      data.gallery = res;
      return data;
    });
}

module.exports.render = function(uri, data, local) {
  console.log(uri, local);

  return getArticleElastic(data).then(data => data);
};
