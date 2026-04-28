const { HelloService } = require('./apps/api/dist/hello.service.js');

module.exports = {
  nextDir: './apps/web',
  rpcManifestPath: './apps/web/lib/wexts/wexts.rpc.manifest.json',
  rpcServices: {
    hello: new HelloService(),
  },
  security: {
    allowedOrigins: ['http://localhost:3000'],
    rpc: { requireAuth: true },
  },
};
