'use strict';

const { idQuerySource, queryIndexTagsByDate } = require('../../services/server/querys'),
  index = 'articles',
  filterField = 'internalUrl',
  source1 = ['items'],
  source = ['image', 'title'];

function getArticlesByTags(data, tags) {
  return queryIndexTagsByDate(index, tags, source).then(res => {
    data.gallery = res;
    return data;
  });
}

function getCurrentArticleTag(data, id) {
  return idQuerySource(index, id, filterField, source1).then(res => {
    let items = res.map(({ items }) => items),
      tags = items.shift(),
      temp = [];

    tags.forEach(element => {
      temp.push(element.text);
    });
    return getArticlesByTags(data, temp);
  });
}

module.exports.render = function(uri, data, local) {
  let name = 'a';

  if (local.params == null) name = local.url;
  else name = local.params.name;
  return getCurrentArticleTag(data, name).then(data => data);
};
