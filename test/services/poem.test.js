const assert = require('assert');
const app = require('../../src/app');

describe('\'poem\' service', () => {
  it('registered the service', () => {
    const service = app.service('poem');

    assert.ok(service, 'Registered the service');
  });
});
