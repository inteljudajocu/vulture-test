'use strict';

const { idQuerySourceByDate, getPageName } = require('../../services/server/querys'),
  source = ['url', 'date', 'title', 'author', 'image'],
  index = 'articles',
  filterField = 'internalUrl';

function getArticleElastic(data, name) {
  return idQuerySourceByDate(index, name, filterField, source).then(res => {
    data.explore = res;

    return data;
  });
}

module.exports.render = function(uri, data, local) {
  let name = getPageName(local);

  return getArticleElastic(data, name);
};
