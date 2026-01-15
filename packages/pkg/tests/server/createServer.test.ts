import { describe, it, expect, vi, afterEach, beforeAll, afterAll } from 'vitest';
import { createServer, PkgServer } from '../../src/server/createServer';
import { ServerUserConfig } from '../../src/types';
import path from 'path';
import { fileURLToPath } from 'url';
import type { IncomingMessage, ServerResponse } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FIXTURES_DIR = path.join(__dirname, 'fixtures');

// Mock http-proxy-middleware before import
vi.mock('http-proxy-middleware', () => {
  return {
    createProxyMiddleware: vi.fn((opts) => {
      const target = typeof opts === 'string' ? opts : opts.target;
      return (_req: IncomingMessage, res: ServerResponse, _next: unknown) => {
        res.setHeader('X-Proxy-Target', target || 'unknown');
        res.end('proxied');
      };
    }),
  };
});

describe('createServer', () => {
  let serverInstance: PkgServer | null;
  let baseUrl: string;

  // Mock process.cwd to point to fixtures directory
  beforeAll(() => {
    vi.spyOn(process, 'cwd').mockReturnValue(FIXTURES_DIR);
  });

  afterEach(async () => {
    if (serverInstance) {
      await serverInstance.close();
      serverInstance = null;
    }
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  // Helper to start server
  const startServer = async (config: ServerUserConfig) => {
    serverInstance = createServer(config);
    const { port } = await serverInstance.listen();
    baseUrl = `http://localhost:${port}`;
    return serverInstance;
  };

  it('should serve static files from default public directory', async () => {
    await startServer({});
    const res = await fetch(`${baseUrl}/index.html`);
    expect(res.status).toBe(404);
  });

  it('should serve static files from custom public directory', async () => {
    await startServer({ publicDir: { name: 'public' } });
    const res = await fetch(`${baseUrl}/index.html`);
    const text = await res.text();
    expect(res.status).toBe(200);
    expect(text).toContain('Default Public');
  });

  it('should serve bundled files from dist directory when autoServeBundle is true', async () => {
    await startServer({ autoServeBundle: true });
    const res = await fetch(`${baseUrl}/index.js`);
    const text = await res.text();
    expect(res.status).toBe(200);
    expect(text).toContain("console.log('bundle')");
  });

  it('should not serve bundled files when autoServeBundle is false', async () => {
    await startServer({ autoServeBundle: false });
    const res = await fetch(`${baseUrl}/index.js`);
    expect(res.status).toBe(404);
  });

  it('should set custom headers', async () => {
    await startServer({
      headers: {
        'X-Custom-Header': 'foo',
      },
    });
    const res = await fetch(`${baseUrl}/index.html`);
    expect(res.headers.get('X-Custom-Header')).toBe('foo');
  });

  it('should enable cors by default', async () => {
    await startServer({});
    const res = await fetch(`${baseUrl}/index.html`, {
      method: 'OPTIONS',
    });
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  it('should configure cors', async () => {
    await startServer({
      cors: { origin: 'http://example.com' },
    });
    const res = await fetch(`${baseUrl}/index.html`, {
      method: 'OPTIONS',
      headers: {
        Origin: 'http://example.com',
        'Access-Control-Request-Method': 'GET',
      },
    });

    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://example.com');
  });

  it('should disable cors when set to false', async () => {
    await startServer({ cors: false });
    const res = await fetch(`${baseUrl}/index.html`, {
      method: 'OPTIONS',
    });
    expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull();
  });

  it('should configure proxy (object)', async () => {
    await startServer({
      proxy: {
        '/api': {
          target: 'http://api.example.com',
          changeOrigin: true,
        },
      },
    });
    const res = await fetch(`${baseUrl}/api/users`);
    expect(res.headers.get('X-Proxy-Target')).toBe('http://api.example.com');
    const text = await res.text();
    expect(text).toBe('proxied');
  });

  it('should configure proxy (string shortcut)', async () => {
    await startServer({
      proxy: {
        '/api': 'http://api.shortcut.com',
      },
    });
    const res = await fetch(`${baseUrl}/api/users`);
    expect(res.headers.get('X-Proxy-Target')).toBe('http://api.shortcut.com');
  });

  it('should configure proxy (array)', async () => {
    await startServer({
      proxy: [
        {
          target: 'http://api.array.com',
        },
      ],
    });
    // Array config mounts middleware globally using app.use(createProxyMiddleware(options))
    const res = await fetch(`${baseUrl}/any/path`);
    expect(res.headers.get('X-Proxy-Target')).toBe('http://api.array.com');
  });
});
