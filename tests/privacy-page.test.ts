import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const page = readFileSync(new URL('../src/app/privacy/page.tsx', import.meta.url), 'utf8');

describe('privacy and terms page', () => {
  it('has both sections at their link targets', () => {
    assert.match(page, /id="privacy"/);
    assert.match(page, /id="terms"/);
  });

  it('follows the writing guide: no em dashes', () => {
    assert.equal(page.includes('—'), false, 'use a period or a comma instead of an em dash');
  });
});
