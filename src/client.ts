import { Buffer } from 'node:buffer';
import type { GetInfoResponse } from './types.js';

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

  private async request<T>(path: string): Promise<T> {
    const { authHeader, baseUrl } = this.parseAuth();
    const url = `${baseUrl}${path}`;

    let response: Response;
    try {
      response = await fetch(url, { headers: { Authorization: authHeader } });
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
    return this.request<GetInfoResponse>('/info');
  }
}
