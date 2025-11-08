import { Buffer } from 'node:buffer';

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
}
