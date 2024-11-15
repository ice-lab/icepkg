import { MessagePort } from 'node:worker_threads';

export type RpcMethods = Record<string, (...args: any[]) => Promise<any>>;

enum RpcMessageType {
  Request = 'req',
  Response = 'res',
  ResponseError = 'resError'
}

interface RpcBaseMessage {
  __rpc__: string;
  type: RpcMessageType;
}

interface RpcRequestMessage extends RpcBaseMessage {
  id: number;
  type: RpcMessageType.Request;
  method: string;
  args: unknown[];
}

interface RpcResponseMessage extends RpcBaseMessage {
  id: number;
  type: RpcMessageType.Response | RpcMessageType.ResponseError;
  data: unknown;
}

type RpcMessage = RpcRequestMessage | RpcResponseMessage;

const RPC_SIGN = 'pkg-rpc';

function isRpcMessage(message: unknown): message is RpcMessage {
  return message && typeof message === 'object' && (message as RpcMessage).__rpc__ === RPC_SIGN;
}

export class Rpc<R extends RpcMethods, L extends RpcMethods> {
  private requestId = 0;
  private requestStore = new Map<number, [resolve: (v: unknown) => void, reject: (e: unknown) => void]>();

  constructor(private tunnel: MessagePort, private rpcMethods: L) {
    // tunnel.onMessage?.(this.onMessage.bind(this));
    this.tunnel.on('message', this.onMessage.bind(this));
  }

  call<K extends keyof R>(name: K, args: Parameters<R[K]>): ReturnType<R[K]> {
    const reqId = ++this.requestId;

    this.postMessage({
      __rpc__: RPC_SIGN,
      type: RpcMessageType.Request,
      id: reqId,
      method: name as string,
      args: args as unknown[],
    });

    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });

    this.requestStore.set(reqId, [resolve, reject]);

    return promise as ReturnType<R[K]>;
  }

  private onMessage(message: unknown) {
    if (isRpcMessage(message)) {
      switch (message.type) {
        case RpcMessageType.Request: {
          const { id, method, args } = message;
          const fn = this.rpcMethods[method];
          new Promise((resolve, reject) => {
            if (fn) {
              resolve(fn(...args));
            } else {
              reject(new Error(`Method ${method} not found`));
            }
          }).then((returnData) => {
            this.postMessage({
              __rpc__: RPC_SIGN,
              type: RpcMessageType.Response,
              id,
              data: returnData,
            });
          }, (error) => {
            this.postMessage({
              __rpc__: RPC_SIGN,
              type: RpcMessageType.ResponseError,
              id,
              // TODO: stringify error
              data: error,
            });
          });
          break;
        }
        case RpcMessageType.ResponseError:
        case RpcMessageType.Response: {
          const { id, data } = message;
          const fn = this.requestStore.get(id);
          if (fn) {
            this.requestStore.delete(id);
            fn[message.type === RpcMessageType.Response ? 0 : 1](data);
          }
          break;
        }
      }
    }
  }

  private postMessage(data: RpcMessage) {
    this.tunnel.postMessage(data);
  }
}
