import { SimpleFin } from './client.js';
import { describe, expect, it } from 'vitest';

describe('SimpleFinClient', () => {
  it('should throw if setup token is empty', async () => {
    await expect(SimpleFin.fromSetupToken('')).rejects.toThrow(
      'Setup token is required to generate an access URL.',
    );
  });
});
