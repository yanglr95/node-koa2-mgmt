/**
 * app
 */
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const Koa = require('koa');
const Pug = require('koa-pug');

const staticServe = require('koa-static');
const bodyParser = require('koa-body');

const sessionStore = require('koa-session');
const redisStore = require('koa-redis');
const validate = require('koa-validate');

const router = require('./controller/index.js');
const service = require('./service/index.js');
const middleware = require('./middleware/index.js');
const CSRF = require('./middleware/csrf.js');

const { config } = require('./util/index.js');
const { host, port } = config;

const app = new Koa();
const pug = new Pug(config.pug);

app.name = config.name;
app.keys = config.keys;
app.env = config.env;
app.proxy = true;

// pug
pug.use(app);
// mount service
service(app);
// mount validate
validate(app);

// XResponseTime
app.use(middleware.XResponseTime);
// middleware
app.use(middleware.middleware);

// livereload
if (config.debug) {
  app.use(require('koa-livereload')());
}

// session
app.use(sessionStore(
  Object.assign({}, config.session, { store: redisStore(config.sessionStore) }),
  app));

// body parser
app.use(
  bodyParser(config.bodyParser)
);

// csrf
app.use(new CSRF());

// init state
app.use(async(ctx, next) => {
  const session = ctx.session;

  // init state
  ctx.state = {
    isLogin: false,
    debug: config.debug,
    user: null,
    session: ctx.session,
    path: ctx.path
  };

  ctx.state.__defineGetter__('csrf', () => {
    return ctx.csrf;
  });

  // user state
  if (session.isAdminLogin) {
    ctx.state.isLogin = true;
    ctx.state.user = ctx.session.adminUser;
  }
  return next();
});

router(app)
  .use(staticServe('./public'));

if (!config.debug && cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // master server start
  app.listen(port, host, () => {
    console.log(`[INFO] Server running on http://${host}:${port}`);
  });
}
