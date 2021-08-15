const createProxyMiddleware = require('http-proxy-middleware');
const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
  env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'http://localhost:8080';

const context = [
  "/weatherforecast",
//#if (IndividualLocalAuth)
  "/_configuration",
  "/.well-known",
  "/Identity",
  "/connect",
  "/ApplyDatabaseMigrations",
//#endif
];

const onError = (err, req, resp, target) => {
    console.error(`${err.message}`);
}

module.exports = function (app) {
  const appProxy = createProxyMiddleware(context, {
    target: target,
    //by handling errors, we prevent the proxy middleware from crashing outright when
    //the ASP NET Core webserver is unavailable, for example if it has been restarted
    onError: onError,
    secure: false
    //uncomment this line if using websockets
    //ws: true 
  });

  app.use(appProxy);
};
