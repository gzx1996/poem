module.exports = async function (app) {
  let poems = await app.service('poem').Model.find();
  poems = JSON.parse(JSON.stringify( poems ));
  poems.map(poem => {
    const regex = /[ |?|？|,|，|.|。|!|！|…|、|\n |：|: |; |；]/g;
    const str = poem.text.replace(regex,''); 
    Redis.hset('poem', poem._id.toString(), str, () => {});
  });
};
