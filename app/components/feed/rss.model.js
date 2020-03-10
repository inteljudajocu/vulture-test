'use strict';

function addEntrys(data) {
  const { articles } = data,
    items = [];

  articles.forEach(element => {
    let item = [
      { title: element.title },
      { link: element.url },
      { pubDate: date2UTC(element.date) },
      { guid: [{ _attr: { isPermaLink: 'false' } }, element.guid] },
      { author: element.author + '@example.com (' + element.author + ')' },
      // { img: element.image },
      { description: element.description },
      { category: 'rss' }
    ];

    items.push(item);
  });
  delete data.articles;
  return (data.feed = items);
}

function date2UTC(date) {
  const da = new Date(date);

  return da.toUTCString();
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

  return data;
};
