import { Buffer } from 'node:buffer';
import type { GetAccountsResponse, GetInfoResponse } from './types.js';
import { toUnixEpoch } from './utils.js';

// TODO: Custom Error Handling to Reduce Code Duplication
export class SimpleFin {
  accessUrl: string;

  constructor(accessUrl: string) {
    this.accessUrl = accessUrl;
  }

  static async fromSetupToken(setupToken: string): Promise<SimpleFin> {
    if (!setupToken) {
      throw new Error('Setup token is required to generate an access URL.');
    }

    const claimUrl = Buffer.from(setupToken, 'base64').toString('utf-8');

    let result: Response;
    try {
      result = await fetch(claimUrl, { method: 'POST' });
    } catch (err) {
      throw new Error(
        `Failed to reach the SimpleFIN Bridge: ${(err as Error).message}`,
      );
    }

    if (!result.ok) {
      throw new Error(
        `Failed to claim access URL: ${result.status} ${result.statusText}`,
      );
    }

    const accessUrl = (await result.text()).trim();

    return new SimpleFin(accessUrl);
  }

  static fromAccessUrl(accessUrl: string): SimpleFin {
    if (!accessUrl) {
      throw new Error(
        'An access url is required. See the `fromSetupToken` method if you need to generate one',
      );
    }
    return new SimpleFin(accessUrl);
  }

  private parseAuth() {
    if (!this.accessUrl) {
      throw new Error(
        'An access url is required. See the `fromSetupToken` method if you need to generate one',
      );
    }

    const [scheme, rest] = this.accessUrl.split('//');

    if (rest === undefined) {
      throw new Error(`Invalid access token: ${this.accessUrl}`);
    }
    const [auth, remainder] = rest.split('@');

    if (auth === undefined) {
      throw new Error(`Invalid access token: ${this.accessUrl}`);
    }

    const [username, password] = auth.split(':');
    const baseUrl = `${scheme}//${remainder}`;

    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

    return {
      authHeader,
      baseUrl,
    };
  }

  private async request<T>(
    path: string,
    options: {
      method: 'GET' | 'POST';
      params?: Record<string, string | number | boolean | undefined | string[]>;
    },
  ): Promise<T> {
    const { authHeader, baseUrl } = this.parseAuth();

    const url = new URL(`${baseUrl}${path}`);
    if (options?.params) {
      for (const [key, value] of Object.entries(options.params)) {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => url.searchParams.append(key, String(v)));
          } else {
            url.searchParams.set(key, String(value));
          }
        }
      }
    }

    let response: Response;
    try {
      response = await fetch(url.toString(), {
        method: options?.method ?? 'GET',
        headers: { Authorization: authHeader },
      });
    } catch (err) {
      throw new Error(
        `Failed to reach SimpleFIN server: ${(err as Error).message}`,
      );
    }

    if (!response.ok) {
      throw new Error(
        `SimpleFIN request failed: ${response.status} ${response.statusText}`,
      );
    }

    return response.json() as Promise<T>;
  }

  async getInfo(): Promise<GetInfoResponse> {
    return this.request<GetInfoResponse>('/info', { method: 'GET' });
  }

  async getAccounts(params?: {
    startDate?: string | number | Date;
    endDate?: string | number | Date;
    pending?: boolean;
    account?: string | string[];
    balancesOnly?: boolean;
  }): Promise<GetAccountsResponse> {
    const query: Record<
      string,
      string | number | boolean | undefined | string[]
    > = {};

    if (params) {
      if (params.startDate) query['start-date'] = toUnixEpoch(params.startDate);
      if (params.endDate) query['end-date'] = toUnixEpoch(params.endDate);
      if (params.pending) query['pending'] = 1;
      if (params.balancesOnly) query['balances-only'] = 1;

      if (params.account) {
        query['account'] = Array.isArray(params.account)
          ? params.account
          : [params.account];
      }
    }

    return this.request<GetAccountsResponse>('/accounts', {
      method: 'GET',
      params: query,
    });
  }
}
