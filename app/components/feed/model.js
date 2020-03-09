'use strict';

const { rawQuery } = require('../../services/server/querys'),
  index = 'articles';

function rawArticle(data) {
  return rawQuery(index).then(res => {
    const articles = [];

    res.forEach(element => {
      let item = {
        title: element.title,
        url: element.url,
        date: element.date,
        author: element.author,
        image: element.image
      };

      articles.push(item);
    });
    data.articles = articles;

    return data;
  });
}

module.exports.render = function(uri, data) {
  return rawArticle(data);
};
