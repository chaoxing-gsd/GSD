
var path = require('path');
var fs = require('fs');

var appDirectory = fs.realpathSync(process.cwd());
function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

module.exports = {
  target: 'http://localhost',
  defaultHost: 'localhost',
  defaultPort: 8890,
  appBuild: resolveApp('build'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appIndexJs: resolveApp('src/index.js'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appStyle: resolveApp('src/assets/styles'),
  appNodeModules: resolveApp('node_modules'),
  ownNodeModules: resolveApp('node_modules'),
  proxy: 'http://gsd.chaoxing.com/',
  proxyTarget: 'http://gsd.chaoxing.com/',
  proxyPath: '/gsd-apis'
};


