const cheerio = require('cheerio');
const axios = require('axios');
const getUrls = require('get-urls');

const URL = 'https://ng-check.com';

async function visitAndScrapLink(link) {
  const content = (await axios.get(link)).data;
  const $ = cheerio.load(content);

  const dataObj = {};
  dataObj.companyName = $('h1').text();
  dataObj.basicInfo = getBasicInfo(content);

  return [dataObj]
}


function getBasicInfo(html) {
  const $ = cheerio.load(html);
  const basicInfo = $('main').find('.row')[2];
  const rows = $(basicInfo).find('tr');
  const data = [];
  
  rows.each(function (i, el) {
    const td = $(this).find('td')[1];
    data[i] = $(td).text();
  });

  const ret = {
    status: data[1],
    entityType: data[2],
    activity: data[3],
    regNo: data[4],
    regDate: data[5]
  }
  return ret;
}

async function start() {
  const content = (await axios.get(URL)).data;
  const $ = cheerio.load(content);
  const linksStore = $('.well')[0];
  const links = [];
  $(linksStore).find('a').each(function (i, el) {
    links.push(`${URL}${$(this).attr('href')}`)
  });
  const firstSite = await visitAndScrapLink(links[0]);
  return true;
}

start();