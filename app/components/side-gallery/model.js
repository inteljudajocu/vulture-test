'use strict';

const { idQuerySource, getPageName } = require('../../services/server/querys'),
  source = ['gallery'],
  index = 'galleries',
  filterField = 'internalUrl';

module.exports.render = function(uri, data, local) {
  let name = getPageName(local);

  return getGalleryElastic(data, name);
};

function getGalleryElastic(data, id) {
  return idQuerySource(index, id, filterField, source).then(respond => {
    if (respond.gallery != null) data.gallery = respond;
    return data;
  });
}
