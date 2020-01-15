const assert = require('assert');
const app = require('../../src/app');

describe('\'author\' service', () => {
  it('registered the service', () => {
    const service = app.service('author');

    assert.ok(service, 'Registered the service');
  });
});
