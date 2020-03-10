'use strict';

function addEntrys(data) {
  const { articles } = data,
    items = [],
    feed = [];

  articles.forEach(element => {
    let item = [
      { title: element.title },
      { a: element.url },
      { date: element.date },
      { author: element.author },
      { img: element.image },
      { description: element.description },
      { category: 'rss' }
    ];

    items.push(item);
  });
  delete data.articles;
  return (data.feed = items);
}

function addMeta(data) {
  return (data.meta = {
    title: 'rss',
    description: 'rss format',
    link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  });
}

function addAttr(data) {
  return (data.attr = {});
}

module.exports = function(uri, data) {
  addMeta(data);
  addEntrys(data);
  addAttr(data);

  console.log('This is data HIII >>>>>> ', data);

  return data;
};
