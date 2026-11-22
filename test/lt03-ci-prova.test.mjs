import test from 'node:test';
import assert from 'node:assert/strict';

test('a CI deve falhar quando um teste falha', () => {
  assert.fail('Falha intencional para o aceite da LT03');
});
