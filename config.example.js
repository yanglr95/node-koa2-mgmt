var path = require('path');

var env = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 4001;
var host = process.env.HOST || '0.0.0.0';

var DEBUG = (env !== 'production');
const web_isConsole = false;

var global_locals_for_all_pages = {
  site_name: '后台管理系统',
  site_title: '',
  site_keywords: '',
  site_description: ''
};

// db 0:null , 1: cache, 2:web-sesion, 3:mgmt-session
var redisMaster = {
  host: '127.0.0.1',
  port: 6379,
  db: 1,
  auth_pass: 'HoomSun1'
};

var redisSession = {
  host: '127.0.0.1',
  port: 6379,
  db: 3,
  auth_pass: 'HoomSun1'
};

module.exports = {
  name: 'mgmt',
  keys: ['hoomxb secret key'],
  host: host,
  port: port,
  console: web_isConsole,
  debug: DEBUG,
  static: path.join(__dirname, 'public'),
  session: {
    key: 'sid',
    maxAge: 24 * 60 * 60 * 1000,
  },
  sessionStore: redisSession,
  redisMaster: redisMaster,
  bodyParser: {
    multipart: true,
    formLimit: '1024kb',
    formidable: {
      keepExtensions: true,
      uploadDir: './public/upload/',
      hash: 'md5',
    }
  },
  pug: {
    viewPath: './view',
    debug: false,
    pretty: DEBUG,
    compileDebug: DEBUG,
    locals: global_locals_for_all_pages,
    helperPath: [
      { 'UIHelper': path.resolve(__dirname, './util/helper.js') },
      { _: require('lodash') }
    ],
  },
  apiBase: 'http://192.168.1.26:8090'
};