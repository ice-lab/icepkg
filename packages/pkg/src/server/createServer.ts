import { ServerUserConfig } from '../types.js';
import type Express from 'express';
import express from 'express';
import http from 'node:http';
import https from 'node:https';
import http2 from 'node:http2';
import path from 'node:path';
import fs from 'node:fs';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { consola } from 'consola';
import pc from 'picocolors';
import cors from 'cors';
import { getAddressUrls } from './utils.js';

export const DEFAULT_PORT = 5138;
export const DEFAULT_HOST = '0.0.0.0';

export interface PkgServer {
  app: Express.Application;
  httpServer: import('node:http').Server | import('node:https').Server | import('node:http2').Http2SecureServer | null;
  listen: () => Promise<{
    port: number;
    urls: string[];
    server: {
      close: () => Promise<void>;
    };
  }>;
  port: number;
  close: () => Promise<void>;
  printUrls: () => void;
}

export function createServer(serverConfig: ServerUserConfig): PkgServer {
  const {
    port: configPort = DEFAULT_PORT,
    host = DEFAULT_HOST,
    publicDir: publicDirConfig,
    headers,
    cors: corsConfig,
    proxy,
    autoServeBundle = true,
    https: httpsConfig,
  } = serverConfig;
  const app = express();

  if (headers) {
    app.use((req, res, next) => {
      Object.entries(headers).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => res.setHeader(key, v));
        } else {
          res.setHeader(key, value);
        }
      });
      next();
    });
  }

  if (proxy) {
    if (Array.isArray(proxy)) {
      proxy.forEach((p) => app.use(createProxyMiddleware(p)));
    } else {
      Object.entries(proxy).forEach(([context, options]) => {
        if (typeof options === 'string') {
          app.use(context, createProxyMiddleware({ target: options, changeOrigin: true }));
        } else {
          app.use(context, createProxyMiddleware(options));
        }
      });
    }
  }

  if (corsConfig !== false) {
    const options = corsConfig === true ? undefined : corsConfig;
    app.use(cors(options));
  }

  if (autoServeBundle) {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
  }

  if (publicDirConfig) {
    const dirs = Array.isArray(publicDirConfig) ? publicDirConfig : [publicDirConfig];
    dirs.forEach((dir) => {
      let publicDir: string | undefined;
      if (typeof dir === 'string') {
        publicDir = dir;
      } else if (typeof dir === 'object') {
        publicDir = dir.name;
      }

      if (publicDir) {
        const staticPath = path.resolve(process.cwd(), publicDir);
        if (fs.existsSync(staticPath)) {
          app.use(express.static(staticPath));
        }
      }
    });
  }

  let httpServer: http.Server | https.Server | http2.Http2SecureServer;

  if (httpsConfig) {
    if (proxy) {
      // http-proxy-middleware is not compatible with HTTP/2
      httpServer = https.createServer(httpsConfig as https.ServerOptions, app);
    } else {
      httpServer = http2.createSecureServer(
        {
          allowHTTP1: true,
          maxSessionMemory: 1024,
          ...httpsConfig,
        },
        // @ts-expect-error req type mismatch
        app,
      );
    }
  } else {
    httpServer = http.createServer(app);
  }

  let resolvedPort = configPort;

  const devServerAPI: PkgServer = {
    app: app,
    httpServer,
    get port() {
      return resolvedPort;
    },
    listen: async () => {
      const findPort = async (startPort: number): Promise<number> => {
        return new Promise((resolve, reject) => {
          const s = http.createServer();
          s.on('error', (err: any) => {
            if (err.code === 'EADDRINUSE') {
              s.close();
              resolve(findPort(startPort + 1));
            } else {
              reject(err);
            }
          });
          s.listen(startPort, host, () => {
            s.close(() => resolve(startPort));
          });
        });
      };

      resolvedPort = await findPort(resolvedPort);

      return new Promise((resolve) => {
        httpServer.listen(resolvedPort, host, () => {
          const hostname = host === '0.0.0.0' ? 'localhost' : host;
          const protocol = httpsConfig ? 'https' : 'http';
          const urls = [`${protocol}://${hostname}:${resolvedPort}`];
          resolve({
            port: resolvedPort,
            urls,
            server: {
              close: devServerAPI.close,
            },
          });
        });
      });
    },
    close: async () => {
      if (httpServer.listening) {
        return new Promise<void>((resolve, reject) => {
          httpServer.close((err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      }
    },
    printUrls: () => {
      const protocol = httpsConfig ? 'https' : 'http';
      const urls = getAddressUrls(protocol, resolvedPort, host);
      // eslint-disable-next-line no-console
      console.log();
      urls.forEach(({ label, url }) => {
        consola.log(`${label}${pc.cyan(url)}`);
      });
      // eslint-disable-next-line no-console
      console.log();
    },
  };

  return devServerAPI;
}
