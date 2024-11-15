import { describe, it, expect } from 'vitest';
import { Rpc, RpcMethods } from '../../src/helpers/rpc';
import { MessageChannel } from 'node:worker_threads';

interface TestMethods extends RpcMethods {
  testMethod(arg: string): Promise<string>;
}

const serverMethods: TestMethods = {
  testMethod: async (arg: string) => `result-${arg}`,
};

describe('Rpc', () => {
  it('should handle call method correctly', async () => {
    const channel = new MessageChannel();
    const clientRpc = new Rpc<TestMethods, {}>(channel.port1, {});
    const serverRpc = new Rpc<{}, TestMethods>(channel.port2, serverMethods);
    const resultPromise = clientRpc.call('testMethod', ['arg1']);
    const result = await resultPromise;
    expect(result)
      .toBe('result-arg1');
  });

  it('should handle errors in the server method', async () => {
    const channel = new MessageChannel();
    const serverMethodsWithError: TestMethods = {
      testMethod: async (arg: string) => {
        if (arg === 'error') {
          throw new Error('Server error');
        }
        return `result-${arg}`;
      },
    };
    const clientRpc = new Rpc<TestMethods, {}>(channel.port1, {});
    const serverRpc = new Rpc<{}, TestMethods>(channel.port2, serverMethodsWithError);
    try {
      await clientRpc.call('testMethod', ['error']);
    } catch (error) {
      expect(error.message)
        .toBe('Server error');
    }
  });

  it('should throw error for non-existent method', async () => {
    const channel = new MessageChannel();
    const serverRpc = new Rpc<{}, TestMethods>(channel.port2, serverMethods);
    const clientRpc = new Rpc<TestMethods, {}>(channel.port1, {});
    try {
      await clientRpc.call('nonExistentMethod', []);
    } catch (error) {
      expect(error.message).toBe('Method nonExistentMethod not found');
    }
  });
});
