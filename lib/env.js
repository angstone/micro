//const appRoot = require('app-root-path');

const env = {};

env.app_topic = process.env.APP_TOPIC || 'as';

env.production = process.env.PRODUCTION || false;

env.debug = process.env.DEBUG || env.production ? false : true;

env.nats_url = process.env.NATS_URL || 'nats://localhost:4222',
env.nats_user = process.env.NATS_USER || 'ruser',
env.nats_pass = process.env.NATS_PW || 'T0pS3cr3t',

env.hemera_logLevel = process.env.HEMERA_LOG_LEVEL || env.debug ? 'error' : 'fatal',
env.hemera_timeout = process.env.HEMERA_TIMEOUT || env.debug ? 4000 : 8000,

  //rules: appRoot+'/'+(process.env.RULES || '../rules'),
  //models: appRoot+'/'+(process.env.MODELS || '../models'),



  //mock: false,

  //es_gateway: process.env.ES_GATEWAY || 'http://eventstore:2113',
  //es_host: process.env.ES_HOST || 'eventstore',
  //es_port: process.env.ES_PORT || 1113,
  //es_debug: process.env.ES_DEBUG || false,
  //es_username: process.env.ES_USERNAME || 'admin',
  //es_password: process.env.ES_PASSWORD || 'changeit',

  //mongodb_host: process.env.MONGODB_HOST || 'mongodb://mongodb/',

  //elastic_hosts: process.env.ELASTIC_HOSTS ? process.env.ELASTIC_HOSTS.split(',') : ['http://elasticsearch:9200'],
  //elastic_httpAuth: process.env.ELASTIC_HTTP_AUTH || null,
  //elastic_log: process.env.ELASTIC_LOG || 'warning',
  //elastic_pingTimeout: process.env.ELASTIC_PING_TIMEOUT || 3000,
  //elastic_ssl: {
  //  pfx: process.env.ELASTIC_SSL_PFX || null,
  //  key: process.env.ELASTIC_SSL_KEY || null,
  //  passphrase: process.env.ELASTIC_SSL_PASSPHRASE || null,
  //  cert: process.env.CERT || null,
  //  ca: process.env.ELASTIC_SSL_CA || null,
  //  ciphers: process.env.ELASTIC_SSL_CIPHERS || null,
  //  rejectUnauthorized: process.env.ELASTIC_SSL_REJECT_UNAUTHORIZED || false,
  //  secureProtocol: process.env.ELASTIC_SSL_SECURE_PROTOCOL || null
  //},

module.exports = env;
