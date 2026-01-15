import os from 'node:os';
import pc from 'picocolors';

export const getIpv4Interfaces = () => {
  const interfaces = os.networkInterfaces();
  const ipv4Interfaces: os.NetworkInterfaceInfo[] = [];

  Object.values(interfaces).forEach((key) => {
    key?.forEach((detail) => {
      // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
      if (detail.family === 'IPv4' || (detail.family as any) === 4) {
        ipv4Interfaces.push(detail);
      }
    });
  });
  return ipv4Interfaces;
};

export const getAddressUrls = (protocol: string, port: number, host: string) => {
  const LOCAL_LABEL = `  ${pc.green('➜')}  ${pc.bold('Local')}:   `;
  const NETWORK_LABEL = `  ${pc.green('➜')}  ${pc.bold('Network')}: `;

  if (host && host !== '0.0.0.0') {
    return [{ label: LOCAL_LABEL, url: `${protocol}://${host}:${port}` }];
  }

  const urls: Array<{ label: string; url: string }> = [];
  const interfaces = getIpv4Interfaces();
  let hasLocal = false;
  interfaces.forEach((detail) => {
    if (detail.internal || detail.address === '127.0.0.1' || detail.address === '::1') {
      if (!hasLocal) {
        urls.push({ label: LOCAL_LABEL, url: `${protocol}://localhost:${port}` });
        hasLocal = true;
      }
    } else {
      urls.push({ label: NETWORK_LABEL, url: `${protocol}://${detail.address}:${port}` });
    }
  });
  return urls;
};
