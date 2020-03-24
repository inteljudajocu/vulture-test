'use strict';

/**
 *
 * @param {pbject} data
 * @returns {object}
 */
function addEntrys(data) {
  const { articles } = data,
    items = [];

  articles.forEach(element => {
    let item = [
      { title: element.title },
      { link: element.url },
      { pubDate: date2UTC(element.date) },
      { guid: [{ _attr: { isPermaLink: 'false' } }, element.guid] },
      { author: authors2mails(element.author) },
      { description: element.description },
      { category: 'rss' }
    ];

    items.push(item);
  });
  delete data.articles;
  return (data.feed = items);
}

/**
 *
 * @param {string} author
 * @returns {string}
 */
function authors2mails(author) {
  return author + '@gmail.com (' + author + ')';
}

/**
 *
 * @param {string} date
 * @returns {string}
 */
function date2UTC(date) {
  const da = new Date(date);

  return da.toUTCString();
}

/**
 *
 * @param {object} data
 * @returns {object}
 */
function addMeta(data) {
  return (data.meta = {
    title: 'rss',
    description: 'rss format',
    link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  });
}

/**
 *
 * @param {object} data
 * @returns {object}
 */
function addAttr(data) {
  return (data.attr = {});
}

module.exports = function(uri, data) {
  addMeta(data);
  addEntrys(data);
  addAttr(data);

  return data;
};
