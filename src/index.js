import { parseSingleBrand, parseBrandList } from './crawler';
import pAll from 'p-all';
import R from 'ramda';
import { writeFile } from 'jsonfile';



const skmBaseUrl = (pageid) => `http://www.skm.com.tw/zh-TW/Brand/Search?Store=4d6c8b25-f31a-4d83-b016-d97973648188&Brand=00000000-0000-0000-0000-000000000000&Product=00000000-0000-0000-0000-000000000000&Branch=00000000-0000-0000-0000-000000000000&Floor=00000000-0000-0000-0000-000000000000&page=${pageid}&X-Requested-With=XMLHttpRequest`

async function main() {
  // const pages = new Array(72).fill(0).map((_, i) => i + 1);
  // const urls = await pAll(pages.map((pageid) => () => parseBrandList(skmBaseUrl(pageid))));
  // console.log(R.flatten(urls).length);
  // writeFile('../urls.json', R.flatten(urls));
  // const result = await parseBrandList(skmBaseUrl(1));
  // const result = await parseSingleBrand('http://www.skm.com.tw/zh-TW/Brand/Detail?StoreID=4d6c8b25-f31a-4d83-b016-d97973648188&BrandID=9b779973-5bd3-4005-9724-ec95dadec72d');
  // console.log();
  const urls = require('../urls.json');
  const result = await pAll(urls.map((url) => () => parseSingleBrand(url)), { concurrency: 10 });
  console.log(result);
  writeFile('./data.json', result);
}

main();
