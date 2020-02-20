'use strict';

const { idQuerySource } = require('../../services/server/querys'),
  source = ['gallery'],
  index = 'galleries',
  filterField = 'internalUrl';

module.exports.render = function(uri, data, local) {
  let name = 'a';

  if (local.params == null) name = local.url;
  else name = local.params.name;

  return getGalleryElastic(data, name).then(data => data);
};

function getGalleryElastic(data, id) {
  return idQuerySource(index, id, filterField, source)
    .then(({ hits }) => hits.hits)
    .then(hits => hits.map(({ _source }) => _source))
    .then(respond => {
      if (respond.gallery != null) data.gallery = respond;
      return data;
    });
}
