// Initializes the `author` service on path `/author`
const { Author } = require('./author.class');
const createModel = require('../../models/author.model');
const hooks = require('./author.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/author', new Author(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('author');

  service.hooks(hooks);
};
