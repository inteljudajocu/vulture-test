'use strict';

const { search } = require('../../services/server/elastic');

function videoPlayer(videoSrc) {
  if (videoSrc != '') return videoSrc.replace('watch?v=', 'embed/');
  return videoSrc;
}

module.exports.render = function(uri, data, local) {
  let { videoSrc } = data;

  data.videoSrc = videoPlayer(videoSrc);

  return getVideoElastic(data, local.params.name).then(data => data);
};

function getVideoElastic(data, name) {
  let query = {
    query: {
      bool: {
        must: {
          query_string: {
            query: name,
            default_field: 'internalUrl'
          }
        }
      }
    }
  };

  return search('local_video', query)
    .then(({ hits }) => hits.hits)
    .then(hits => {
      let { _source } = hits[0];

      return _source.videoUrl;
    })
    .then(res => {
      data.videoSrc = res;

      return data;
    });
}
