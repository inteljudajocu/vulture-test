'use strict';

const _get = require('lodash/get'),
  striptags = require('striptags'),
  dateFormat = require('date-fns/format'),
  dateParse = require('date-fns/parse'),
  utils = require('../../services/universal/utils'),
  has = utils.has, // convenience
  sanitize = require('../../services/universal/sanitize'),
  clayutils = require('clayutils'),
  paras = [];

/**
 * only allow emphasis, italic, and strikethroughs in headlines
 * @param  {string} oldHeadline
 * @returns {string}
 */
function stripHeadlineTags(oldHeadline) {
  const newHeadline = striptags(oldHeadline, ['em', 'i', 'strike']);

  // if any tags include a trailing space, shift it to outside the tag
  return newHeadline.replace(/ <\/(i|em|strike)>/g, '</$1> ');
}

/**
 * sanitize headline
 * @param  {object} data
 */
function sanitizeInputs(data) {
  if (has(data.headline)) {
    data.headline = sanitize.toSmartHeadline(stripHeadlineTags(data.headline));
  }
}

/**
 * set the publish date from the locals (even if it's already set),
 * and format it correctly
 * @param  {object} data
 * @param  {object} locals
 */
function formatDate(data, locals) {
  if (_get(locals, 'date')) {
    // if locals and locals.date exists, set the article date (overriding any date already set)
    data.date = dateFormat(locals.date); // ISO 8601 date string
  } else if (has(data.articleDate) || has(data.articleTime)) {
    // make sure both date and time are set. if the user only set one, set the other to today / right now
    data.articleDate = has(data.articleDate)
      ? data.articleDate
      : dateFormat(new Date(), 'YYYY-MM-DD');
    data.articleTime = has(data.articleTime) ? data.articleTime : dateFormat(new Date(), 'HH:mm');
    // generate the `date` data from these two fields
    data.date = dateFormat(dateParse(`${data.articleDate} ${data.articleTime}`)); // ISO 8601 date string
  }
}

/**
 * set the canonical url from the locals (even if it's already set)
 * @param {object} data
 * @param {object} locals
 */
function setCanonicalUrl(data, locals) {
  if (_get(locals, 'publishUrl')) {
    data.canonicalUrl = locals.publishUrl;
  }
}

/**
 * Set the feed image to the lede url if it isn't already set
 * @param  {object} data
 */
function generateFeedImage(data) {
  if (data.ledeUrl) {
    data.feedImgUrl = data.ledeUrl;
  }
}
function addInstanceAdvertesiment(ref) {
  let temp;

  temp = ref.substring(0, ref.lastIndexOf('/') + 1);
  return temp.concat('top-side');
}

// function addAdvertesiment(data) {
//   let temp, replacer;

//   for (let index = 0; index < data.length; index++) {
//     if (
//       clayutils.getComponentName(data[index]._ref) == 'paragraph' &&
//       index % 4 === 0 &&
//       index != 0
//     ) {
//       temp = data[index];
//       replacer = temp._ref.replace('paragraph', 'advertisement');
//       temp._ref = addInstanceAdvertesiment(replacer);
//       paras.push(temp);
//     } else paras.push(data[index]);
//   }
//   return paras;
// }

// module.exports.render = function(uri, data) {
//   let { content } = data;

//   addAdvertesiment(content);
//   return data;
// };

module.exports.save = function(uri, data, locals) {
  // first, let's get all the synchronous stuff out of the way:
  // sanitizing inputs, setting fields, etc
  sanitizeInputs(data);
  formatDate(data, locals);
  setCanonicalUrl(data, locals);
  generateFeedImage(data);

  return data;
};
