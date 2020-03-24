'use strict';

const { elastic } = require('amphora-search'),
  { isPublished, getComponentName, isPage, getPageInstance } = require('clayutils'),
  _parse = require('url-parse');

function createFilter({ components, includePage }) {
  return item => {
    return (
      // isPublished(item.key) &&
      components.includes(getComponentName(item.key)) || (includePage && isPage(item.key))
    );
  };
}

function getMainComponentRef(ops) {
  const page = getPage(ops),
    mainComponent = getComponentByName(ops, 'article');

  mainComponent.key = page.key;

  return mainComponent;
}

function getPage(ops) {
  return ops.find(op => isPage(op.key));
}

function getComponentByName(ops, componentName) {
  return ops.find(op => getComponentName(op.key) === componentName);
}

function getComponentRef(ops, key) {
  return ops.find(op => op.key === key);
}

function getComponentContent(content, componentName) {
  return content.find(op => getComponentName(op._ref) === componentName);
}

function put(index, ref, source) {
  return elastic.client.index({
    index,
    type: '_doc',
    id: ref,
    body: source
  });
}

function del(index, ref) {
  return elastic.client.delete({
    index,
    type: '_doc',
    id: ref
  });
}

function getIndexFromFilename(filename = '') {
  return filename
    .split('/')
    .pop()
    .replace('.js', '');
}

function getPublishUri(uri) {
  return checkPublish(uri);
}

function getUri(uri) {
  return getPageInstance(uri);
}

function checkPublish(uri) {
  return isPublished(uri);
}

function urlToUri(url) {
  const parsed = _parse(url);

  return `${parsed.hostname}${parsed.pathname}`;
}

function uriToPublished(uri) {
  if (checkPublish(uri)) {
    return uri;
  } else {
    return uri.concat('@published');
  }
}

module.exports.urlToUri = urlToUri;
module.exports.getIndexFromFilename = getIndexFromFilename;
module.exports.getPublishUri = getPublishUri;
module.exports.getComponentByName = getComponentByName;
module.exports.put = put;
module.exports.del = del;
module.exports.getComponentContent = getComponentContent;
module.exports.getMainComponentRef = getMainComponentRef;
module.exports.createFilter = createFilter;
module.exports.uriToPublished = uriToPublished;
module.exports.getComponentRef = getComponentRef;
module.exports.getUri = getUri;
