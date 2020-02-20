'use strict';

const { search } = require('../../services/server/elastic');

module.exports.render = function(uri, data, local) {
  let name = 'a';

  if (local.params == null) name = local.url;
  else name = local.params.name;

  return getGalleryElastic(data, name).then(data => data);
};

function getGalleryElastic(data, name) {
  const query = {
    _source: ['gallery'],
    size: 1,
    query: {
      bool: {
        must: {
          query_string: {
            query: name,
            default_field: 'internalUrl'
          }
        }
      }
    }
  };

  return search('galleries', query)
    .then(({ hits }) => hits.hits)
    .then(hits => hits.map(({ _source }) => _source))
    .then(respond => {
      if (respond.gallery != null) data.gallery = respond;
      return data;
    });
}
