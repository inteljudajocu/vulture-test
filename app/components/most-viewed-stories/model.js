'use strict';

const { idQuerySourceByDate } = require('../../services/server/querys'),
  source = ['url', 'date', 'title'],
  index = 'local_articles',
  filterField = 'internalUrl';

function getArticleElastic(data, name) {
  return idQuerySourceByDate(index, name, filterField, source).then(res => {
    data.stories = res;
    return data;
  });
}

module.exports.render = function(uri, data, local) {
  let name = 'a';

  if (local.params == null) name = local.url;
  else name = local.params.name;
  return getArticleElastic(data, name).then(data => data);
};
