// Initializes the `poem` service on path `/poem`
const { Poem } = require('./poem.class');
const createModel = require('../../models/poem.model');
const hooks = require('./poem.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: true
  };

  // Initialize our service with any options it requires
  app.use('/api/poem', new Poem(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/poem');

  service.hooks(hooks);

  app.configure(require('./init'));
  app.configure(require('./spider'));
};
