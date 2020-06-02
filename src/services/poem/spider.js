module.exports = async function (app) {
  const cheerio = require('cheerio');
  const axios = require('axios');
  const fn = async (baseUrl = 'http://www.shicimingju.com/chaxun/zuozhe/10.html') => {
    let rs = await axios.get(baseUrl);
    let $ = cheerio.load(rs.data);
    let urlList = [];
    let result = [];
    let list_all = $('#list_nav_all a');
    Object.keys(list_all).forEach(k=>{
      if(!isNaN(parseInt(k)))urlList.push($(list_all[k]).attr('href'));
    });
    for(let i = 0; i < urlList.length; i++) {
      let u = urlList[i];
      let url = 'http://www.shicimingju.com' + u;
      let r = await perPage(url);
      if(r.length > 0) result = result.concat(r);
    }
    let bulkList = result.map(d => {
      return {
        insertOne: {
          document : d,
        }
      };
    });
    try{
      console.log(bulkList.length);
      const res = await app.service('api/poem').create(result);
      console.log(res);
    }catch(e){
      console.log(e);
    }
  };
  const perPage = async (url) => {
    let rs = await axios.get(url);
    const $ = cheerio.load(rs.data);
    let list = [];
    $('.shici_list_main').each(function(i,elem){
      let title = $(elem).children('h3').children().text();
      let text = $(elem).children('.shici_content').text().replace(/[' '|\n]/g, '').replace('展开全文', '').replace('收起', '')
      let obj = { title, text };
      Object.assign(obj, {author: '李白'});
      list.push(obj);
    });
    return list;
  };
  fn();
};