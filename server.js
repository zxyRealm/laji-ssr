const url = require('url');
const fs = require('fs');
const path = require('path');
const LRU = require('lru-cache');
const express = require('express');
const favicon = require('serve-favicon');
const compression = require('compression');
const microcache = require('route-cache');
const resolve = file => path.resolve(__dirname, file);
const { createBundleRenderer } = require('vue-server-renderer');
const proxy = require('http-proxy-middleware');
const https = require('https');
const httpsProxyAgent = require('https-proxy-agent');
const isProd = process.env.NODE_ENV === 'production';
const useMicroCache = process.env.MICRO_CACHE !== 'false';
const serverInfo =
  `express/${require('express/package.json').version} ` +
  `vue-server-renderer/${require('vue-server-renderer/package.json').version}`;

const app = express();
app.set('env','production');
function createRenderer (bundle, options) {
  // https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
  return createBundleRenderer(bundle, Object.assign(options, {
    // for component caching
    cache: LRU({
      max: 1000,
      maxAge: 1000 * 60 * 15
    }),
    // this is only needed when vue-server-renderer is npm-linked
    basedir: resolve('./dist'),
    // recommended for performance
    runInNewContext: false
  }))
}

let renderer;
let readyPromise;
const templatePath = resolve('./index.template.html');
if (isProd) {
  // In production: create server renderer using template and built server bundle.
  // The server bundle is generated by vue-ssr-webpack-plugin.
  const template = fs.readFileSync(templatePath, 'utf-8');
  const bundle = require('./dist/vue-ssr-server-bundle.json');
  // The client manifests are optional, but it allows the renderer
  // to automatically infer preload/prefetch links and directly add <script>
  // tags for any async chunks used during render, avoiding waterfall requests.
  const clientManifest = require('./dist/vue-ssr-client-manifest.json');
  renderer = createRenderer(bundle, {
    template,
    clientManifest
  })
} else {
  // In development: setup the dev server with watch and hot-reload,
  // and create a new renderer on bundle / index template update.
  readyPromise = require('./build/setup-dev-server')(
    app,
    templatePath,
    (bundle, options) => {
      renderer = createRenderer(bundle, options)
    }
  )
}

const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
});

app.use(compression({ threshold: 0 }));
app.use(favicon('./static/favicon.ico'));
app.use('/dist', serve('./dist', true));
app.use('/static', serve('./static', true));
// app.use('/manifest.json', serve('./manifest.json', true));
app.use('/service-worker.js', serve('./dist/service-worker.js'));

// since this app has no user-specific content, every page is micro-cacheable.
// if your app involves user-specific content, you need to implement custom
// logic to determine whether a request is cacheable based on its url and
// headers.
// 1-second microcache.
// https://www.nginx.com/blog/benefits-of-microcaching-nginx/
app.use(microcache.cacheSeconds(1, req => useMicroCache && req.originalUrl));

function render (req, res) {
  const s = Date.now();

  res.setHeader("Content-Type", "text/html");
  res.setHeader("Server", serverInfo);

  const handleError = err => {
    if (err.url) {
      res.redirect(err.url)
    } else if(err.code === 404) {
      res.status(404).send('404 | Page Not Found')
    } else {
      // Render Error Page or Redirect
      res.status(500).send('500 | Internal Server Error');
      console.error(`error during render : ${req.url}`);
      console.error(err.stack)

    }
  };

  const context = {
    title: '辣鸡小说', // default title
    url: req.url
  };
  renderer.renderToString(context, (err, html) => {
    if (err) {
      return handleError(err)
    }
    res.send(html);
    if (!isProd) {
      console.log(`whole request: ${Date.now() - s}ms`)
    }
  })
}


const Proxy = process.env.http_proxy || 'http://127.0.0.1:80/api';
console.log('using proxy server %j', Proxy);

// HTTPS endpoint for the proxy to connect to
const endpoint = process.argv[2] || 'https://118.31.187.224:80';
console.log('attempting to GET %j', endpoint);
const options = url.parse(endpoint);

// create an instance of the `HttpsProxyAgent` class with the proxy server information
const agent = new httpsProxyAgent(Proxy);
options.agent = agent;
https.get(options,render);


// app.use(
//   '/api',
//   proxy({
//     target: "https://118.31.187.224",
//     changeOrigin: true,
//     pathRewrite:{
//       "^/api":""
//     }
//   })
// );

// app.get('*', isProd ? render : (req, res) => {
//   readyPromise.then(() => render(req, res))
// });

const port = process.env.PORT || 80;
app.listen(port, () => {
  console.log(`server started at localhost:${port}`)
});
