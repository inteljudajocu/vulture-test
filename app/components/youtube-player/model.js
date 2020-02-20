'use strict';

const { search } = require('../../services/server/elastic');

function videoPlayer(videoSrc) {
  if (videoSrc != '') return videoSrc.replace('watch?v=', 'embed/');
  return videoSrc;
}

module.exports.render = function(uri, data, local) {
  let { videoSrc } = data,
    name = 'a';

  data.videoSrc = videoPlayer(videoSrc);
  if (local.params == null) name = local.url;
  else name = local.params.name;

  return getVideoElastic(data, name).then(data => data);
};

function getVideoElastic(data, name) {
  const query = {
    size: 1,
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

  return search('video', query)
    .then(({ hits }) => hits.hits)
    .then(hits => hits.map(({ _source }) => _source))
    .then(respond => {
      let result = respond.shift();

      if (result.videoUrl != '' && result.videoUrl != null) data.videoSrc = result.videoUrl;
      return data;
    });
}
