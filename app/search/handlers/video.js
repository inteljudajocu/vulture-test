'use strict';

const h = require('highland'),
  { subscribe, helpers } = require('amphora-search'),
  {
    put,
    del,
    uriToPublished,
    createFilter,
    getIndexFromFilename,
    getMainComponentRef,
    getComponentByName
  } = require('../utils'),
  index = helpers.indexWithPrefix(getIndexFromFilename(__filename)),
  filter = createFilter({
    components: ['article', 'youtube-player'],
    includePage: true
  }),
  log = require('../../services/universal/log').setup({ file: __filename });

subscribe('save').through(handleSave);

subscribe('unpublishPage').through(handleUnpublish);

function handleSave(stream) {
  return stream
    .map(handleStreams)
    .merge()
    .map(putToElastic)
    .errors(logErrors)
    .each(logSuccess);
}

function handleStreams(stream) {
  return stream
    .filter(filter)
    .map(helpers.parseOpValue)
    .collect()
    .map(parseComponent);
}

function parseComponent(ops) {
  const mainComponent = getMainComponentRef(ops),
    ytPlaer = getComponentByName(ops, 'youtube-player'),
    { videoSrc } = ytPlaer.value;

  return {
    key: mainComponent.key,
    source: {
      videoUrl: videoSrc,
      internalUrl: mainComponent.key
    }
  };
}

function putToElastic(obj) {
  return put(index, obj.key, obj.source);
}

function handleUnpublish(stream) {
  return stream
    .map(handleStreamUnpublish)
    .errors(logErrors)
    .each(logSuccess);
}

function handleStreamUnpublish(op) {
  return del(index, uriToPublished(op.uri));
}

function logErrors(errors) {
  log('error', errors);
}

function logSuccess(res) {
  log('info', res);
}
