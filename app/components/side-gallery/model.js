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

  return search('video', query)
    .then(({ hits }) => hits.hits)
    .then(hits => hits.map(({ _source }) => _source))
    .then(respond => {
      data.gallery = respond;
      return data;
    });
}
