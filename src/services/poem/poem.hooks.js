const feathers = require('@feathersjs/feathers');
const Mod = {
  async check(ctx){
    const regex = /[ |?|？|,|，|.|。|!|！|…]/g;
    const content = ctx.data.content.replace(regex,''); 
    const _id = ctx.data._id;
    let total = await new Promise((resolve) => {
      Redis.hget('poem', _id, (err, res) => {
        if(err) resolve(null);
        resolve(res);
      });
    });
    ctx.result = {
      code: 1,
      data: total.includes(content)
    };
    return feathers.SKIP;
  }
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [ctx => {
      if(Mod[ctx.id]) return Mod[ctx.id](ctx);
    }],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [ctx => {
      const author = ctx.result.author;
      ctx.app.service('author').Model.updateOne({ 'name': author }, { 'name': author }, { 'upsert': true });
    }],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
