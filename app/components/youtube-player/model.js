'use strict';

const { idQuerySource, getPageName } = require('../../services/server/querys'),
  source = ['videoUrl'],
  index = 'videos',
  filterField = 'internalUrl';

function videoPlayer(videoSrc) {
  if (videoSrc != '') return videoSrc.replace('watch?v=', 'embed/');
  return videoSrc;
}

module.exports.render = function(uri, data, local) {
  let { videoSrc } = data,
    name = getPageName(local);

  data.videoSrc = videoPlayer(videoSrc);

  return getVideoElastic(data, name);
};

function getVideoElastic(data, id) {
  return idQuerySource(index, id, filterField, source).then(respond => {
    if (respond.videoUrl != null) data.videoSrc = respond.videoUrl;
    return data;
  });
}
