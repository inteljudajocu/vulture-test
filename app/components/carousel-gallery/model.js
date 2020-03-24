'use strict';

const {
    idQuerySource,
    queryIndexTagsByDate,
    getPageName,
    _idQuery
  } = require('../../services/server/querys'),
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
      temp = tags.map(({ text }) => text);

    return getArticlesByTags(data, temp);
  });
}

module.exports.render = function(uri, data, local) {
  let name = getPageName(local);

  _idQuery(index, name).then(res => {
    console.log(res);
    return res;
  });

  return getCurrentArticleTag(data, name);
};
