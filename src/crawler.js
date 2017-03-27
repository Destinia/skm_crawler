import cheerio from 'cheerio';
import debug from 'debug';
import fetch from 'node-fetch';

const rootUrl = 'http://www.skm.com.tw/';

const parseLocation = ($) => (i, el) => {
  const phone = $(el).find('em.red').text();
  $(el).find('span.phone').remove();
  const location = $(el).text();
  return ({ phone, location });
};

const parseInfo = ($) => (i, el) => {
  const text = $(el).text();
  const parseSingleSuggestion = (_, ele) => {
    const name = $(ele).find('p.prdName').text();
    $(ele).find('p.prdName').remove();
    return ({
      image: rootUrl + $(ele).find('img').attr('src'),
      name,
      description: $(ele).text().trim(),
      fbShare: $(ele).find('span.prdPic').find('a').attr('href'),
    });
  };
  const parseActivity = (_, ele) => ({
    title: $(ele).find('h4.contentRedTitle').text(),
    image: rootUrl + $(ele).find('li.intPic').find('img').attr('src'),
    introduction: $(ele).find('li.introduction').find('p').text().trim(),
    link: rootUrl + $(ele).find('a.more').attr('href'),
  });
  switch (text) {
    case '品牌推薦':
      return {
        sugestion: $('div.BrandRcmd').find('ul').find('li.prdBlk').map(parseSingleSuggestion).toArray(),
      };
    case '品牌活動':
      return {
        activity: $('div.NewPrdList').map(parseActivity).toArray(),
      };
    default:
      return {};
  }
};

const parseBrandContent = ($) => ({
  name: $('h4.contentRedTitle').text(),
  description: $('dd.bd_Rcol').find('p').first().text(),
  locations: $('div.shopLocation').find('ul.level').find('li').map(parseLocation($)).toArray(),
  category: $('a.leftItem.current').text(),
  image: rootUrl + $('dt.bd_Lcol').find('img').attr('src'),
  ...$('h3.contentBlkTitle').map(parseInfo($)).toArray()
    .reduce((prev, cur) => ({ ...prev, ...cur }), {}),
});

const parseListContent = ($) =>
  $('div.listBlk').map((i, el) =>
    rootUrl + $(el).find('ul.searchCont').find('a').first().attr('href'))
    .toArray();

export function parseBrandList(url) {
  return fetch(url)
    .then((res) => res.text())
    .then(result => cheerio.load(result))
    .then($ => parseListContent($));
}

export function parseSingleBrand(url) {
  return fetch(url)
      .then((res) => res.text())
      .then(result => cheerio.load(result))
      .then($ => parseBrandContent($));
}
