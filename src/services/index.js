const poem = require('./poem/poem.service.js');
const author = require('./author/author.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(poem);
  app.configure(author);
};
