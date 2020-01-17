module.exports = async function (app) {
  let poems = await app.service('api/poem').Model.find();
  poems = JSON.parse(JSON.stringify( poems ));
  poems.map(poem => {
    const regex = /[ |?|？|,|，|.|。|!|！|…]/g;
    const str = poem.text.replace(regex,''); 
    Redis.hset('poem', poem._id.toString(), str, () => {});
  });
};
