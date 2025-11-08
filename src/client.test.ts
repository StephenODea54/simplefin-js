import { SimpleFin } from './client.js';
import { describe, expect, it } from 'vitest';

describe('SimpleFinClient', () => {
  it('should throw if setup token is empty', async () => {
    await expect(SimpleFin.fromSetupToken('')).rejects.toThrow(
      'Setup token is required to generate an access URL.',
    );
  });

  it('fetches a demo setup token from SimpleFin and exchanges it for an access URL', async () => {
    const result = await fetch(
      'https://beta-bridge.simplefin.org/info/developers',
    );

    if (!result.ok) {
      throw new Error(`Failed to fetch developers page: ${result.status}`);
    }

    const html = await result.text();

    // Extract the base64 token inside <pre class="code">...</pre>
    const match = html.match(
      /<pre class="code">\s*([A-Za-z0-9+/=]+)\s*<\/pre>/,
    );
    if (!match || match === undefined) {
      throw new Error('Could not find demo setup token in page');
    }

    const setupToken = match[1];

    if (setupToken === undefined) {
      throw new Error('Failed to parse setup token');
    }

    expect(setupToken).toMatch(/^[A-Za-z0-9+/=]+$/);

    const simpleFinClient = await SimpleFin.fromSetupToken(setupToken);
    expect(simpleFinClient).toBeInstanceOf(SimpleFin);

    /* Can't actually check for predetermined value of access token.
       As a middle ground, we check to make sure the URL looks valid. */
    const accessUrl = simpleFinClient.accessUrl;
    expect(typeof accessUrl).toBe('string');
    expect(accessUrl.startsWith('https://')).toBe(true);
  });
});
