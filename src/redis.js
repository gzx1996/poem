const redis = require('redis');

module.exports = function(app) {
  const conf = app.get('redis') || 'redis://127.0.0.1:6379/1?connect_timeout=10000';
  global.Redis = redis.createClient(conf).on('connect', () => {
    console.log('redis connect ok!', conf);
  }).on('error', (err) => {
    console.error('redis error: ', err);
  });
};