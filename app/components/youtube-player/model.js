'use strict';

function videoPlayer(videoSrc) {
  if (videoSrc != '') return videoSrc.replace('watch?v=', 'embed/');
  return videoSrc;
}

module.exports.render = function(uri, data) {
  let { videoSrc } = data;

  data.videoSrc = videoPlayer(videoSrc);
  return data;
};
