'use strict';

const { rawQuery } = require('../../services/server/querys'),
  index = 'articles',
  descp =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean egestas dapibus justo, at hendrerit nisl tincidunt vel. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla gravida luctus justo, quis sagittis dolor porttitor et. Pellentesque consectetur dolor eget porta elementum. Morbi at convallis nibh, vel viverra quam. Nunc aliquam blandit sodales. Donec tempor vehicula arcu. Etiam id fermentum risus, eget consectetur augue. Cras ornare lacinia purus a dictum. Suspendisse et mi in ex vulputate maximus consectetur vitae arcu. Duis iaculis metus non felis mollis auctor. Pellentesque orci massa, ultrices quis lorem et, iaculis consectetur arcu. Maecenas sagittis nisi et libero tincidunt condimentum. Cras molestie augue in enim laoreet malesuada.';

function rawArticle(data) {
  return rawQuery(index).then(res => {
    const articles = [];

    res.forEach(element => {
      let item = {
        title: element.title,
        url: element.url,
        guid: element.internalUrl,
        date: element.date,
        author: element.author,
        image: element.image,
        description: descp
      };

      articles.push(item);
    });
    data.articles = articles;

    return data;
  });
}

module.exports.render = function(uri, data) {
  return rawArticle(data);
};
