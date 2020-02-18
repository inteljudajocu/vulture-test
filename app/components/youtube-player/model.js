'use strict';

const { search } = require('../../services/server/elastic'),
  query = {
    query: {
      match_all: {}
    }
  };

function videoPlayer(videoSrc) {
  if (videoSrc != '') return videoSrc.replace('watch?v=', 'embed/');
  return videoSrc;
}

module.exports.render = function(uri, data, local) {
  let { videoSrc } = data;

  data.videoSrc = videoPlayer(videoSrc);

  return getVideoElastic(data, local).then(data => data);
};

function getVideoElastic(data, local) {
  return search('local_video', query)
    .then(({ hits }) => hits.hits)
    .then(hits => {
      let { _id, _source } = hits[0],
        temp;

      return (temp = { id: _id, video: _source.videoUrl });
    })
    .then(res => {
      console.log(local.params.name);

      if (res.id.includes(local.params.name)) data.videoSrc = res.video;

      return data;
    });
}
