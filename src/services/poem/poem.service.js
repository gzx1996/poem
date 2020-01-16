// Initializes the `poem` service on path `/poem`
const { Poem } = require('./poem.class');
const createModel = require('../../models/poem.model');
const hooks = require('./poem.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/poem', new Poem(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('poem');

  service.hooks(hooks);

  app.configure(require('./init'));
  // app.configure(require('./spider'));
};
